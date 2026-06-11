from models.usuario_model import UsuarioModel

usuarios_model = UsuarioModel()

dados = {
    "nome": "teste",
    "email": "teste@gmail",
    "senha": "123",
    "perfil": "admin",
    "status": "ativo"
}

usuarios_model.inserir_usuario(dados)

print("Usuário administrador criado com sucesso.")