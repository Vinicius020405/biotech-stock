from models.crud_base import CrudBase
from core.database import conectar
import base64
 
 
# Modelo responsável pelos produtos
class ProdutoModel(CrudBase):
    def __init__(self):
        # Define a tabela e os campos do produto
        super().__init__(
            tabela="produto",
            chave_primaria="id_produto",
            campos=[
                "codigo",
                "nome",
                "descricao",
                "unidade_medida",
                "estoque_minimo",
                "estoque_maximo",
                "status",
                "imagem_nome",
                "imagem_tipo",
                "imagem_blob"
            ]
        )
 
    # Lista todos os produtos
    def listar(self):
        # Conecta ao banco
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        sql = """
            SELECT *                
            FROM produto
            ORDER BY nome
        """
 
        cursor.execute(sql)
        produtos = cursor.fetchall()
 
        # Fecha a conexão
        cursor.close()
        conexao.close()
 
        # Prepara a imagem em Base64
        for produto in produtos:
            produto["imagem_base64"] = None
         
            if produto["imagem_blob"]:
                imagem_base64 = base64.b64encode(produto["imagem_blob"]).decode("utf-8")
                produto["imagem_base64"] = imagem_base64
 
        return produtos
 
    # Busca um produto pelo ID com sua imagem
    def buscar_por_id_com_imagem(self, id_produto):
        # Conecta ao banco
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        sql = """
            SELECT 
                id_produto,
                codigo,
                nome,
                descricao,
                unidade_medida,
                estoque_minimo,
                estoque_maximo,
                status,
                imagem_nome,
                imagem_tipo,
                imagem_blob
            FROM produto
            WHERE id_produto = %s
        """
 
        cursor.execute(sql, (id_produto,))
        produto = cursor.fetchone()
 
        # Fecha a conexão
        cursor.close()
        conexao.close()
 
        # Converte a imagem para Base64
        if produto and produto["imagem_blob"]:
            produto["imagem_base64"] = base64.b64encode(
                produto["imagem_blob"]
            ).decode("utf-8")
        elif produto:
            produto["imagem_base64"] = None
 
        return produto
 
    # Busca produtos com estoque abaixo do mínimo
    def buscar_estoque_baixo(self):
        """
        Soma o saldo atual na tabela 'estoque' (atualizado via Pedidos de Entrada e Saída)
        e compara com o 'estoque_minimo' cadastrado.
        """
        # Conecta ao banco
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
 
        sql = """
            SELECT 
                p.id_produto,
                p.codigo,
                p.nome,
                p.estoque_minimo,
                COALESCE(SUM(e.quantidade_atual), 0) AS quantidade
            FROM produto p
            LEFT JOIN estoque e ON p.id_produto = e.id_produto
            WHERE p.status = 'ativo'
            GROUP BY p.id_produto, p.codigo, p.nome, p.estoque_minimo
            HAVING quantidade <= p.estoque_minimo
        """
 
        cursor.execute(sql)
        produtos_criticos = cursor.fetchall()
 
        # Fecha a conexão
        cursor.close()
        conexao.close()
 
        return produtos_criticos
