from models.crud_base import CrudBase
from core.database import conectar


# Modelo responsável pelo estoque
class EstoqueModel(CrudBase):

    # Inicializa as configurações do estoque
    def __init__(self):
        super().__init__(
            tabela="estoque",
            chave_primaria="id_estoque",
            campos=[
                "id_produto",
                "id_localizacao",
                "quantidade_atual",
                "estoque_minimo"
            ]
        )

    # Lista o estoque completo
    def listar_completo(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Busca os dados do estoque, produto e localização
        sql = """
            SELECT 
                e.id_estoque,
                p.id_produto,
                p.nome AS produto,
                p.codigo,
                p.unidade_medida,
                l.id_localizacao,
                l.nome AS localizacao,
                l.setor,
                p.estoque_minimo,
                e.quantidade_atual,
                e.atualizado_em

            FROM estoque e

            INNER JOIN produto p
                ON e.id_produto = p.id_produto

            INNER JOIN localizacao l
                ON e.id_localizacao = l.id_localizacao

            ORDER BY p.nome
        """

        cursor.execute(sql)

        dados = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return dados

    # Lista produtos que estão com estoque baixo
    def listar_estoque_baixo(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Soma o estoque e compara com o estoque mínimo
        sql = """
            SELECT
                p.id_produto,
                p.nome,
                p.codigo AS produto,
                p.estoque_minimo,
                COALESCE(SUM(e.quantidade_atual), 0) AS quantidade_atual

            FROM produto p

            LEFT JOIN estoque e
                ON e.id_produto = p.id_produto

            GROUP BY
                p.id_produto,
                p.nome,
                p.codigo,
                p.estoque_minimo

            HAVING
                COALESCE(SUM(e.quantidade_atual), 0) <= p.estoque_minimo

            ORDER BY
                quantidade_atual ASC
            """

        cursor.execute(sql)

        alertas = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return alertas

    # Conta os itens que possuem quantidade em estoque
    def contar_itens_em_estoque(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = """
            SELECT COUNT(*) AS total
            FROM estoque
            WHERE quantidade_atual > 0
        """

        cursor.execute(sql)

        resultado = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return resultado["total"]

    # Busca o estoque de um produto
    def buscar_por_produto(self, id_produto):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Busca o produto e sua localização no estoque
        sql = """
            SELECT
                e.id_estoque,
                e.id_produto,
                e.id_localizacao,
                e.quantidade_atual,
                p.nome AS produto,
                p.codigo,
                p.estoque_minimo,
                l.nome AS localizacao,
                l.setor

            FROM estoque e

            INNER JOIN produto p
                ON e.id_produto = p.id_produto

            INNER JOIN localizacao l
                ON e.id_localizacao = l.id_localizacao

            WHERE e.id_produto = %s
        """

        cursor.execute(sql, (id_produto,))

        resultado = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return resultado

    # Busca o estoque de uma localização
    def buscar_por_localizacao(self, id_localizacao):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Busca os produtos armazenados na localização
        sql = """
            SELECT
                e.id_estoque,
                e.id_produto,
                e.id_localizacao,
                e.quantidade_atual,
                p.nome AS produto,
                p.codigo,
                p.estoque_minimo,
                l.nome AS localizacao,
                l.setor

            FROM estoque e

            INNER JOIN produto p
                ON e.id_produto = p.id_produto

            INNER JOIN localizacao l
                ON e.id_localizacao = l.id_localizacao

            WHERE e.id_localizacao = %s

            ORDER BY p.nome
        """

        cursor.execute(sql, (id_localizacao,))

        dados = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return dados

    # Atualiza a quantidade do estoque
    def atualizar_quantidade(self, id_estoque, quantidade):
        conexao = conectar()
        cursor = conexao.cursor()

        sql = """
            UPDATE estoque
            SET quantidade_atual = %s
            WHERE id_estoque = %s
        """

        cursor.execute(sql, (quantidade, id_estoque))

        conexao.commit()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return True

    # Adiciona uma quantidade ao estoque
    def adicionar_quantidade(self, id_estoque, quantidade):
        conexao = conectar()
        cursor = conexao.cursor()

        sql = """
            UPDATE estoque
            SET quantidade_atual = quantidade_atual + %s
            WHERE id_estoque = %s
        """

        cursor.execute(sql, (quantidade, id_estoque))

        conexao.commit()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return True

    # Remove uma quantidade do estoque
    def remover_quantidade(self, id_estoque, quantidade):
        conexao = conectar()
        cursor = conexao.cursor()

        # Remove somente se houver quantidade suficiente
        sql = """
            UPDATE estoque
            SET quantidade_atual = quantidade_atual - %s
            WHERE id_estoque = %s
              AND quantidade_atual >= %s
        """

        cursor.execute(
            sql,
            (
                quantidade,
                id_estoque,
                quantidade
            )
        )

        conexao.commit()

        # Verifica se alguma linha foi alterada
        linhas_afetadas = cursor.rowcount

        cursor.close()
        conexao.close()

        return linhas_afetadas > 0

    # Verifica se o estoque está abaixo do mínimo
    def estoque_esta_baixo(self, id_estoque):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = """
            SELECT
                e.quantidade_atual,
                p.estoque_minimo

            FROM estoque e

            INNER JOIN produto p
                ON e.id_produto = p.id_produto

            WHERE e.id_estoque = %s
        """

        cursor.execute(sql, (id_estoque,))

        resultado = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        # Caso o estoque não seja encontrado
        if not resultado:
            return False

        # Compara a quantidade atual com o estoque mínimo
        return (
            resultado["quantidade_atual"]
            <= resultado["estoque_minimo"]
        )
