from models.crud_base import CrudBase
from core.database import conectar
import base64

class CaminhaoModel(CrudBase):


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

    def listar(self):

        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = """
            SELECT *
            FROM caminhao
            ORDER BY placa
            """

        cursor.execute(sql)

        caminhoes = cursor.fetchall()

        cursor.close()
        conexao.close()

        for caminhao in caminhoes:

            caminhao["imagem_base64"] = None

            if caminhao["imagem_blob"]:

                imagem_base64 = base64.b64encode(
                caminhao["imagem_blob"]
            ).decode("utf-8")

            caminhao["imagem_base64"] = imagem_base64

        return caminhoes

    def buscar_por_id_com_imagem(self, id_caminhao):

        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

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

        cursor.close()
        conexao.close()

        if caminhao and caminhao["imagem_blob"]:

            caminhao["imagem_base64"] = base64.b64encode(
            caminhao["imagem_blob"]
        ).decode("utf-8")

        elif caminhao:

            caminhao["imagem_base64"] = None

        return caminhao
