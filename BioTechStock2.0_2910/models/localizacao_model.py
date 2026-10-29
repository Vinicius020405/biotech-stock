from models.crud_base import CrudBase


# Modelo responsável pelas localizações
class LocalizacaoModel(CrudBase):

    # Inicializa as configurações da localização
    def __init__(self):
        super().__init__(
            tabela="localizacao",
            chave_primaria="id_localizacao",
            campos=[
                "nome",
                "setor",
                "corredor",
                "prateleira",
                "observacao"
            ]
        )