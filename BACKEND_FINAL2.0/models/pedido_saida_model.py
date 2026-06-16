from core.database import conectar


class PedidoSaidaModel:

    def listar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

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

        cursor.close()
        conexao.close()

        return dados


    def buscar_com_itens(self, id_pedido_saida):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

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

        cursor.close()
        conexao.close()

        return {
            "cabecalho": cabecalho,
            "itens": itens
        }


    def inserir_com_itens(self, cabecalho, itens):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        try:
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


            for item in itens:
                quantidade = float(item["quantidade"])

                self._validar_saldo(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

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

                self._atualizar_estoque_saida(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

            conexao.commit()
            return id_pedido_saida

        except Exception as erro:
            conexao.rollback()
            raise erro

        finally:
            cursor.close()
            conexao.close()


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

            # 2. devolver estoque antigo
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

            # 3. atualizar cabeçalho
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

            # 4. deletar itens antigos
            cursor.execute("""
                DELETE FROM item_pedido_saida
                WHERE id_pedido_saida = %s
            """, (id_pedido_saida,))

            # 5. validar novos itens
            for item in itens:
                self._validar_saldo(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    float(item["quantidade"])
                )

            # 6. inserir novos itens
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

                self._atualizar_estoque_saida(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

            conexao.commit()

        except Exception as erro:
            conexao.rollback()
            raise erro

        finally:
            cursor.close()
            conexao.close()


    def _validar_saldo(self, cursor, id_produto, id_localizacao, quantidade):
        cursor.execute("""
            SELECT quantidade_atual
            FROM estoque
            WHERE id_produto = %s
            AND id_localizacao = %s
        """, (id_produto, id_localizacao))

        estoque = cursor.fetchone()

        if not estoque:
            raise Exception("Produto não encontrado no estoque.")

        if float(estoque["quantidade_atual"]) < quantidade:
            raise Exception("Saldo insuficiente em estoque.")


    def _atualizar_estoque_saida(self, cursor, id_produto, id_localizacao, quantidade):
        cursor.execute("""
            UPDATE estoque
            SET quantidade_atual = quantidade_atual - %s
            WHERE id_produto = %s
            AND id_localizacao = %s
        """, (quantidade, id_produto, id_localizacao))


    def contar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total FROM pedido_saida")
        resultado = cursor.fetchone()

        cursor.close()
        conexao.close()

        return resultado["total"]