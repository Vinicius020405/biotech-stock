from models.crud_base import CrudBase
from core.database import conectar
from core.security import gerar_hash_senha, verificar_senha


# Modelo responsável pelos usuários
class UsuarioModel(CrudBase):

    def __init__(self):

        # Define a tabela e os campos do usuário
        super().__init__(
            tabela="usuarios",
            chave_primaria="id_usuario",
            campos=[
                "nome",
                "email",
                "senha",
                "perfil",
                "status",
                "plano"
            ]
        )

#cadastrar usuario

    # Cadastra um novo usuário
    def inserir_usuario(self, dados):

        # Pega a senha informada
        senha_texto = dados.get("senha")

        # Gera o hash da senha
        dados["senha"] = gerar_hash_senha(
            senha_texto
        )

        return self.inserir(dados)

#atualizar usuario

    # Atualiza os dados do usuário
    def atualizar_usuario(self, id_usuario, dados):

        senha = dados.get("senha")

        # Gera um novo hash se a senha foi informada
        if senha:

            dados["senha"] = gerar_hash_senha(
                senha
            )

        else:

            # Remove a senha dos dados caso não tenha sido informada
            dados.pop("senha", None)

        return self.atualizar(
            id_usuario,
            dados
        )

    # Verifica o login do usuário
    def autenticar(self, email, senha):

        # Conecta ao banco
        conexao = conectar()

        cursor = conexao.cursor(
            dictionary=True
        )

        sql = """
            SELECT *
            FROM usuarios
            WHERE email = %s
            AND status = 'ativo'
        """

        cursor.execute(
            sql,
            (email,)
        )

        usuario = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        # Verifica se o usuário existe
        if usuario is None:
            return None

        senha_banco = usuario["senha"]

        # Verifica se a senha informada está correta
        if verificar_senha(
            senha,
            senha_banco
        ):
            return usuario

        return None
