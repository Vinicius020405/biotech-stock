from core.database import conectar


# Modelo responsável pelos pedidos de saída
class PedidoSaidaModel:

    # Lista todos os pedidos de saída
    def listar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Busca os pedidos e os usuários
        sql = """
            SELECT 
                ps.*,
                u.nome AS usuario
            FROM pedido_saida ps
            INNER JOIN usuarios u 
                ON ps.id_usuario = u.id_usuario
            ORDER BY ps.id_pedido_saida DESC
        """

        cursor.execute(sql)
        dados = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return dados


    # Busca um pedido de saída junto com seus itens
    def buscar_com_itens(self, id_pedido_saida):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Busca os dados principais do pedido
        sql_cabecalho = """
            SELECT 
                ps.*,
                u.nome AS usuario
            FROM pedido_saida ps
            INNER JOIN usuarios u 
                ON ps.id_usuario = u.id_usuario
            WHERE ps.id_pedido_saida = %s
        """

        cursor.execute(sql_cabecalho, (id_pedido_saida,))
        cabecalho = cursor.fetchone()

        # Busca os itens do pedido
        sql_itens = """
            SELECT 
                ips.*,
                p.nome AS produto,
                p.codigo,
                l.nome AS localizacao
            FROM item_pedido_saida ips
            INNER JOIN produto p 
                ON ips.id_produto = p.id_produto
            INNER JOIN localizacao l 
                ON ips.id_localizacao = l.id_localizacao
            WHERE ips.id_pedido_saida = %s
        """

        cursor.execute(sql_itens, (id_pedido_saida,))
        itens = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return {
            "cabecalho": cabecalho,
            "itens": itens
        }


    # Insere um pedido de saída com seus itens
    def inserir_com_itens(self, cabecalho, itens):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        try:
            # Insere os dados principais do pedido
            sql_pedido = """
                INSERT INTO pedido_saida
                (
                    numero_documento,
                    solicitante,
                    data_saida,
                    id_usuario,
                    observacao,
                    status,
                    id_caminhao
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            valores_pedido = (
                cabecalho["numero_documento"],
                cabecalho["solicitante"],
                cabecalho["data_saida"],
                cabecalho["id_usuario"],
                cabecalho.get("observacao"),
                cabecalho.get("status", "finalizado"),
                cabecalho.get("id_caminhao")
            )

            cursor.execute(sql_pedido, valores_pedido)
            id_pedido_saida = cursor.lastrowid


            # Percorre os itens do pedido
            for item in itens:
                quantidade = float(item["quantidade"])

                # Verifica se existe quantidade suficiente no estoque
                self._validar_saldo(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

                # Insere o item do pedido
                sql_item = """
                    INSERT INTO item_pedido_saida
                    (
                        id_pedido_saida,
                        id_produto,
                        id_localizacao,
                        quantidade
                    )
                    VALUES (%s, %s, %s, %s)
                """

                cursor.execute(sql_item, (
                    id_pedido_saida,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                ))

                # Remove a quantidade do estoque
                self._atualizar_estoque_saida(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

            # Confirma as alterações
            conexao.commit()
            return id_pedido_saida

        # Desfaz as alterações caso ocorra algum erro
        except Exception as erro:
            conexao.rollback()
            raise erro

        # Fecha a conexão
        finally:
            cursor.close()
            conexao.close()


    # Atualiza um pedido de saída e seus itens
    def atualizar_com_itens(self, id_pedido_saida, cabecalho, itens):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        try:
            # 1. Buscar itens antigos
            cursor.execute("""
                SELECT id_produto, id_localizacao, quantidade
                FROM item_pedido_saida
                WHERE id_pedido_saida = %s
            """, (id_pedido_saida,))

            itens_antigos = cursor.fetchall()

            # 2. Devolve ao estoque as quantidades antigas
            for item in itens_antigos:
                cursor.execute("""
                    UPDATE estoque
                    SET quantidade_atual = quantidade_atual + %s
                    WHERE id_produto = %s
                    AND id_localizacao = %s
                """, (
                    item["quantidade"],
                    item["id_produto"],
                    item["id_localizacao"]
                ))

            # 3. Atualiza os dados principais do pedido
            cursor.execute("""
                UPDATE pedido_saida
                SET 
                    numero_documento = %s,
                    solicitante = %s,
                    data_saida = %s,
                    observacao = %s,
                    id_caminhao = %s,
                    status = %s
                WHERE id_pedido_saida = %s
            """, (
                cabecalho["numero_documento"],
                cabecalho["solicitante"],
                cabecalho["data_saida"],
                cabecalho.get("observacao"),
                cabecalho.get("id_caminhao"),
                cabecalho.get("status", "finalizado"),
                id_pedido_saida
            ))

            # 4. Deleta os itens antigos
            cursor.execute("""
                DELETE FROM item_pedido_saida
                WHERE id_pedido_saida = %s
            """, (id_pedido_saida,))

            # 5. Verifica o estoque dos novos itens
            for item in itens:
                self._validar_saldo(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    float(item["quantidade"])
                )

            # 6. Insere os novos itens
            for item in itens:
                quantidade = float(item["quantidade"])

                cursor.execute("""
                    INSERT INTO item_pedido_saida
                    (id_pedido_saida, id_produto, id_localizacao, quantidade)
                    VALUES (%s, %s, %s, %s)
                """, (
                    id_pedido_saida,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                ))

                # Atualiza o estoque
                self._atualizar_estoque_saida(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

            conexao.commit()

        # Desfaz as alterações caso ocorra algum erro
        except Exception as erro:
            conexao.rollback()
            raise erro

        finally:
            cursor.close()
            conexao.close()


    # Verifica se existe saldo suficiente no estoque
    def _validar_saldo(self, cursor, id_produto, id_localizacao, quantidade):
        cursor.execute("""
            SELECT quantidade_atual
            FROM estoque
            WHERE id_produto = %s
            AND id_localizacao = %s
        """, (id_produto, id_localizacao))

        estoque = cursor.fetchone()

        # Verifica se o produto existe no estoque
        if not estoque:
            raise Exception("Produto não encontrado no estoque.")

        # Verifica se a quantidade disponível é suficiente
        if float(estoque["quantidade_atual"]) < quantidade:
            raise Exception("Saldo insuficiente em estoque.")


    # Diminui a quantidade do estoque
    def _atualizar_estoque_saida(self, cursor, id_produto, id_localizacao, quantidade):
        cursor.execute("""
            UPDATE estoque
            SET quantidade_atual = quantidade_atual - %s
            WHERE id_produto = %s
            AND id_localizacao = %s
        """, (quantidade, id_produto, id_localizacao))


    # Conta a quantidade de pedidos de saída
    def contar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total FROM pedido_saida")
        resultado = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return resultado["total"]
