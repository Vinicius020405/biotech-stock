from models.crud_base import CrudBase
from core.database import conectar
import base64


# Modelo responsável pelos caminhões
class CaminhaoModel(CrudBase):


    # Inicializa as configurações do modelo
    def __init__(self):
        super().__init__(
        tabela="caminhao",
        chave_primaria="id_caminhao",
        campos=[
            "placa",
            "modelo",
            "cor",
            "marca",
            "chassi",
            "imagem_nome",
            "imagem_tipo",
            "imagem_blob"
        ]
    )

    # Lista todos os caminhões
    def listar(self):

        # Conecta ao banco
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Consulta os caminhões
        sql = """
            SELECT *
            FROM caminhao
            ORDER BY placa
            """

        cursor.execute(sql)

        caminhoes = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        # Converte as imagens para Base64
        for caminhao in caminhoes:

            caminhao["imagem_base64"] = None

            if caminhao["imagem_blob"]:

                imagem_base64 = base64.b64encode(
                caminhao["imagem_blob"]
            ).decode("utf-8")

            caminhao["imagem_base64"] = imagem_base64

        return caminhoes

    # Busca um caminhão pelo ID
    def buscar_por_id_com_imagem(self, id_caminhao):

        # Conecta ao banco
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        # Consulta o caminhão pelo ID
        sql = """
            SELECT
                id_caminhao,
                placa,
                modelo,
                cor,
                marca,
                chassi,
                imagem_nome,
                imagem_tipo,
                imagem_blob
            FROM caminhao
            WHERE id_caminhao = %s
        """

        cursor.execute(sql, (id_caminhao,))

        caminhao = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        # Converte a imagem para Base64
        if caminhao and caminhao["imagem_blob"]:

            caminhao["imagem_base64"] = base64.b64encode(
            caminhao["imagem_blob"]
        ).decode("utf-8")

        elif caminhao:

            caminhao["imagem_base64"] = None

        return caminhao
