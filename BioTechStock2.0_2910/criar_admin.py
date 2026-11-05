from models.usuario_model import UsuarioModel

# Cria uma instância do modelo de usuário
usuarios_model = UsuarioModel()

# Dados do novo usuário
dados = {
    "nome": "teste",
    "email": "teste@gmail",
    "senha": "123",
    "perfil": "admin",
    "status": "ativo"
}

# Insere o usuário no banco
usuarios_model.inserir_usuario(dados)

# Exibe uma mensagem de sucesso
print("Usuário administrador criado com sucesso.")
