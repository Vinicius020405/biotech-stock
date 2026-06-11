from models.crud_base import CrudBase
 
class FornecedorModel(CrudBase):
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
 