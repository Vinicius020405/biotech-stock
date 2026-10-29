from models.crud_base import CrudBase
 

# Modelo responsável pelos fornecedores
class FornecedorModel(CrudBase):

    # Inicializa as configurações do fornecedor
    def __init__(self):
        super().__init__(
            tabela="fornecedor",
            chave_primaria="id_fornecedor",
            campos=[
                "nome",
                "cnpj",
                "email",
                "telefone",
                "endereco",
                "cep",
                "contato_responsavel",
                "status",
                "observacoes"
            ]
        )
