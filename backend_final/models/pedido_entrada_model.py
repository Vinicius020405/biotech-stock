from core.database import conectar


class PedidoEntradaModel:

    def listar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = """
            SELECT 
                pe.*,
                u.nome AS usuario,
                f.nome AS fornecedor_nome
            FROM pedido_entrada pe
            INNER JOIN usuarios u 
                ON pe.id_usuario = u.id_usuario
            LEFT JOIN fornecedor f
                ON pe.id_fornecedor = f.id_fornecedor
            ORDER BY pe.id_pedido_entrada DESC
        """

        cursor.execute(sql)
        dados = cursor.fetchall()

        cursor.close()
        conexao.close()

        return dados


    def buscar_com_itens(self, id_pedido_entrada):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute("""
    SELECT 
        pe.*,
        u.nome AS usuario,
        f.nome AS fornecedor
    FROM pedido_entrada pe
    INNER JOIN usuarios u 
        ON pe.id_usuario = u.id_usuario
    INNER JOIN fornecedor f 
        ON pe.id_fornecedor = f.id_fornecedor
    WHERE pe.id_pedido_entrada = %s
""", (id_pedido_entrada,))

        cabecalho = cursor.fetchone()

        cursor.execute("""
            SELECT 
                ipe.*,
                p.nome AS produto,
                p.codigo,
                l.nome AS localizacao
            FROM item_pedido_entrada ipe
            INNER JOIN produto p 
                ON ipe.id_produto = p.id_produto
            INNER JOIN localizacao l 
                ON ipe.id_localizacao = l.id_localizacao
            WHERE ipe.id_pedido_entrada = %s
        """, (id_pedido_entrada,))

        itens = cursor.fetchall()

        cursor.close()
        conexao.close()

        return {
            "cabecalho": cabecalho,
            "itens": itens
        }


    def inserir_com_itens(self, cabecalho, itens):
        conexao = conectar()
        cursor = conexao.cursor()

        try:
            cursor.execute("""
                INSERT INTO pedido_entrada (
                    numero_documento,
                    data_entrada,
                    id_usuario,
                    observacao,
                    status,
                    id_fornecedor
                )
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                cabecalho["numero_documento"],
                cabecalho["data_entrada"],
                cabecalho["id_usuario"],
                cabecalho.get("observacao"),
                cabecalho.get("status", "finalizado"),
                cabecalho.get("id_fornecedor")
            ))

            id_pedido = cursor.lastrowid

            for item in itens:
                quantidade = float(item["quantidade"])
                valor_unitario = float(item.get("valor_unitario", 0))
                valor_total = quantidade * valor_unitario

                cursor.execute("""
                    INSERT INTO item_pedido_entrada (
                        id_pedido_entrada,
                        id_produto,
                        id_localizacao,
                        quantidade,
                        valor_unitario,
                        valor_total
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    id_pedido,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade,
                    valor_unitario,
                    valor_total
                ))

                self._atualizar_estoque_entrada(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )

            conexao.commit()
            return id_pedido

        except Exception as erro:
            conexao.rollback()
            raise erro

        finally:
            cursor.close()
            conexao.close()


    def _atualizar_estoque_entrada(self, cursor, id_produto, id_localizacao, quantidade):

        cursor.execute("""
            SELECT quantidade_atual
            FROM estoque
            WHERE id_produto = %s
            AND id_localizacao = %s
        """, (id_produto, id_localizacao))

        estoque = cursor.fetchone()

        if estoque is None:
            cursor.execute("""
                INSERT INTO estoque (
                    id_produto,
                    id_localizacao,
                    quantidade_atual
                )
                VALUES (%s, %s, %s)
            """, (id_produto, id_localizacao, quantidade))

        else:
            cursor.execute("""
                UPDATE estoque
                SET quantidade_atual = quantidade_atual + %s
                WHERE id_produto = %s
                AND id_localizacao = %s
            """, (quantidade, id_produto, id_localizacao))


    def atualizar_com_itens(self, id_pedido_entrada, cabecalho, itens):
        conexao = conectar()
        cursor = conexao.cursor()

        try:
            # devolver estoque antigo
            cursor.execute("""
                SELECT * FROM item_pedido_entrada
                WHERE id_pedido_entrada = %s
            """, (id_pedido_entrada,))

            antigos = cursor.fetchall()

            for item in antigos:
                cursor.execute("""
                    UPDATE estoque
                    SET quantidade_atual = quantidade_atual - %s
                    WHERE id_produto = %s
                    AND id_localizacao = %s
                """, (
                    item[3],  # quantidade
                    item[2],  # id_produto
                    item[3]   # id_localizacao (corrigido depois se quiser melhorar)
                ))

            cursor.execute("""
                UPDATE pedido_entrada
                SET 
                    numero_documento = %s,
                    data_entrada = %s,
                    observacao = %s,
                    id_fornecedor = %s,
                    status = %s
                WHERE id_pedido_entrada = %s
            """, (
                cabecalho["numero_documento"],
                cabecalho["data_entrada"],
                cabecalho.get("observacao"),
                cabecalho.get("id_fornecedor"),
                cabecalho.get("status", "finalizado"),
                id_pedido_entrada
            ))

            cursor.execute("""
                DELETE FROM item_pedido_entrada
                WHERE id_pedido_entrada = %s
            """, (id_pedido_entrada,))

            for item in itens:
                quantidade = float(item["quantidade"])

                cursor.execute("""
                    INSERT INTO item_pedido_entrada (
                        id_pedido_entrada,
                        id_produto,
                        id_localizacao,
                        quantidade
                    )
                    VALUES (%s, %s, %s, %s)
                """, (
                    id_pedido_entrada,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                ))

                self._atualizar_estoque_entrada(
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


    def contar(self):
        conexao = conectar()
        cursor = conexao.cursor()

        cursor.execute("SELECT COUNT(*) FROM pedido_entrada")
        total = cursor.fetchone()[0]

        cursor.close()
        conexao.close()

        return total