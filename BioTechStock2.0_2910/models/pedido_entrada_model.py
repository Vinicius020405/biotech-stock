from core.database import conectar
 
 
# Modelo responsável pelos pedidos de entrada
class PedidoEntradaModel:
 
    # Lista todos os pedidos de entrada
    def listar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        # Busca os pedidos, usuários e fornecedores
        cursor.execute("""
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
        """)
 
        dados = cursor.fetchall()
 
        # Fecha a conexão
        cursor.close()
        conexao.close()
 
        return dados
 
    # Busca um pedido junto com seus itens
    def buscar_com_itens(self, id_pedido_entrada):
 
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        # Busca os dados principais do pedido
        cursor.execute("""
            SELECT
                pe.*,
                u.nome AS usuario,
                f.nome AS fornecedor
            FROM pedido_entrada pe
            INNER JOIN usuarios u
                ON pe.id_usuario = u.id_usuario
            LEFT JOIN fornecedor f
                ON pe.id_fornecedor = f.id_fornecedor
            WHERE pe.id_pedido_entrada = %s
        """, (id_pedido_entrada,))
 
        cabecalho = cursor.fetchone()
 
        # Busca os itens do pedido
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
 
        # Fecha a conexão
        cursor.close()
        conexao.close()
 
        return {
            "cabecalho": cabecalho,
            "itens": itens
        }
 
    # Insere um pedido junto com seus itens
    def inserir_com_itens(self, cabecalho, itens):
 
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        try:
 
            # Insere os dados principais do pedido
            cursor.execute("""
                INSERT INTO pedido_entrada(
                    numero_documento,
                    data_entrada,
                    id_usuario,
                    observacao,
                    status,
                    id_fornecedor
                )
                VALUES(%s,%s,%s,%s,%s,%s)
            """,(
                cabecalho["numero_documento"],
                cabecalho["data_entrada"],
                cabecalho["id_usuario"],
                cabecalho.get("observacao"),
                cabecalho.get("status","finalizado"),
                cabecalho.get("id_fornecedor")
            ))
 
            # Pega o ID do pedido criado
            id_pedido = cursor.lastrowid
 
            # Percorre os itens do pedido
            for item in itens:
 
                # Calcula o valor total do item
                quantidade = float(item["quantidade"])
                valor_unitario = float(item["valor_unitario"])
                valor_total = quantidade * valor_unitario
 
                # Insere o item do pedido
                cursor.execute("""
                    INSERT INTO item_pedido_entrada(
                        id_pedido_entrada,
                        id_produto,
                        id_localizacao,
                        quantidade,
                        valor_unitario,
                        valor_total
                    )
                    VALUES(%s,%s,%s,%s,%s,%s)
                """,(
                    id_pedido,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade,
                    valor_unitario,
                    valor_total
                ))
 
                # Atualiza o estoque com a quantidade recebida
                self._atualizar_estoque_entrada(
                    cursor,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade
                )
 
            # Confirma as alterações no banco
            conexao.commit()
 
            return id_pedido
 
        # Desfaz as alterações caso ocorra algum erro
        except Exception as erro:
            conexao.rollback()
            raise erro
 
        # Fecha a conexão no final
        finally:
            cursor.close()
            conexao.close()
 
    # Atualiza um pedido e seus itens
    def atualizar_com_itens(self, id_pedido_entrada, cabecalho, itens):
 
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        try:
 
            # Busca os itens antigos do pedido
            cursor.execute("""
                SELECT
                    id_produto,
                    id_localizacao,
                    quantidade
                FROM item_pedido_entrada
                WHERE id_pedido_entrada=%s
            """,(id_pedido_entrada,))
 
            antigos = cursor.fetchall()
 
            # Remove do estoque as quantidades antigas
            for item in antigos:
 
                cursor.execute("""
                    UPDATE estoque
                    SET quantidade_atual = quantidade_atual - %s
                    WHERE id_produto=%s
                    AND id_localizacao=%s
                """,(
                        item["quantidade"],
                    item["id_produto"],
                    item["id_localizacao"]
                ))
 
            # Atualiza os dados principais do pedido
            cursor.execute("""
                UPDATE pedido_entrada
                SET
                    numero_documento=%s,
                    data_entrada=%s,
                    observacao=%s,
                    id_fornecedor=%s,
                    status=%s
                WHERE id_pedido_entrada=%s
            """,(
                cabecalho["numero_documento"],
                cabecalho["data_entrada"],
                cabecalho.get("observacao"),
                cabecalho.get("id_fornecedor"),
                cabecalho.get("status","finalizado"),
                id_pedido_entrada
            ))
 
            # Remove os itens antigos
            cursor.execute("""
                DELETE FROM item_pedido_entrada
                WHERE id_pedido_entrada=%s
            """,(id_pedido_entrada,))
 
            # Adiciona os novos itens
            for item in itens:
 
                quantidade = float(item["quantidade"])
                valor_unitario = float(item["valor_unitario"])
                valor_total = quantidade * valor_unitario
 
                # Insere o novo item
                cursor.execute("""
                    INSERT INTO item_pedido_entrada(
                        id_pedido_entrada,
                        id_produto,
                        id_localizacao,
                        quantidade,
                        valor_unitario,
                        valor_total
                    )
                    VALUES(%s,%s,%s,%s,%s,%s)
                """,(
                    id_pedido_entrada,
                    item["id_produto"],
                    item["id_localizacao"],
                    quantidade,
                    valor_unitario,
                    valor_total
                ))
 
                # Atualiza o estoque com a nova quantidade
                self._atualizar_estoque_entrada(
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
 
    # Atualiza o estoque após uma entrada
    def _atualizar_estoque_entrada(self, cursor, id_produto, id_localizacao, quantidade):
 
        # Verifica se já existe estoque para o produto e localização
        cursor.execute("""
            SELECT quantidade_atual
            FROM estoque
            WHERE id_produto=%s
            AND id_localizacao=%s
        """,(id_produto,id_localizacao))
 
        estoque = cursor.fetchone()
 
        # Se já existe, adiciona a quantidade
        if estoque:
 
            cursor.execute("""
                UPDATE estoque
                SET quantidade_atual = quantidade_atual + %s
                WHERE id_produto=%s
                AND id_localizacao=%s
            """,(
                quantidade,
                id_produto,
                id_localizacao
            ))
 
        # Se não existe, cria um novo registro de estoque
        else:
 
            cursor.execute("""
                INSERT INTO estoque(
                    id_produto,
                    id_localizacao,
                    quantidade_atual
                )
                VALUES(%s,%s,%s)
            """,(
                id_produto,
                id_localizacao,
                quantidade
            ))
 
    # Conta a quantidade de pedidos de entrada
    def contar(self):
 
        conexao = conectar()
        cursor = conexao.cursor()
 
        cursor.execute("SELECT COUNT(*) FROM pedido_entrada")
 
        total = cursor.fetchone()[0]
 
        # Fecha a conexão
        cursor.close()
        conexao.close()
 
        return total
