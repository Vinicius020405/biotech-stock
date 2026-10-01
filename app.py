from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import os
from werkzeug.utils import secure_filename
from core.security import login_obrigatorio
from functools import wraps

from models.usuario_model import UsuarioModel
from models.produto_model import ProdutoModel
from models.localizacao_model import LocalizacaoModel
from models.estoque_model import EstoqueModel
from models.sensor_model import SensorModel
from models.pedido_entrada_model import PedidoEntradaModel
from models.pedido_saida_model import PedidoSaidaModel
from models.caminhao_model import CaminhaoModel
from models.fornecedor_model import FornecedorModel
from models.notificacao_model import NotificacaoModel




app = Flask(__name__)
app.secret_key = "chave_secreta_do_sistema_estoque"

#instancias do model

usuarios_model = UsuarioModel()
produtos_model = ProdutoModel()
localizacoes_model = LocalizacaoModel()
estoque_model = EstoqueModel()
sensores_model = SensorModel()
pedido_entrada_model = PedidoEntradaModel()
pedido_saida_model = PedidoSaidaModel()
caminhoes_model = CaminhaoModel()
Fornecedor_model = FornecedorModel()
notificacao_model = NotificacaoModel()


#notificacoes base

@app.context_processor
def notificacoes_contexto():
    if "usuario_id" in session:
        lista_notificacoes = notificacao_model.listar()
        quantidade_notificacoes = notificacao_model.contar_nao_lidas()

        return {
            "notificacoes": lista_notificacoes[:5],
            "quantidade_notificacoes": quantidade_notificacoes
        }

    return {
        "notificacoes": [],
        "quantidade_notificacoes": 0
    }


#rotas principais

EXTENSOES_PERMITIDAS = {"image/png", "image/jpeg", "image/jpg", "image/webp"}


def imagem_permitida(tipo_arquivo):
    return tipo_arquivo in EXTENSOES_PERMITIDAS


@app.route("/")
def index():
    return render_template("laddingpage.html")

@app.errorhandler(404)
def pagina_nao_encontrada(error):
    return render_template("404.html"),404

@app.route("/cliente")
@login_obrigatorio
def area_cliente():

    perfil = str(session.get("usuario_perfil", "")).strip().lower()

    if perfil != "cliente":
        flash("Você não possui acesso à área do cliente.", "danger")
        return redirect(url_for("dashboard"))

    return render_template(
        "cliente.html",
        nome=session.get("usuario_nome")
    )


alertas_estoque = produtos_model.buscar_estoque_baixo()

#pagamentos#

PLANOS = {

    "controle": {
        "id": "controle",
        "nivel": "NÍVEL 01",
        "nome": "Controle",
        "descricao": "O essencial para começar",
        "preco": "49,90",
        "icone": "◈",
        "recursos": [
            "Cadastro de produtos",
            "Controle de estoque",
            "Entrada e saída de produtos",
            "Cadastro de fornecedores"
        ]
    },

    "gestao": {
        "id": "gestao",
        "nivel": "NÍVEL 02",
        "nome": "Gestão",
        "descricao": "Gestão profissional e integrada",
        "preco": "99,90",
        "icone": "◆",
        "recursos": [
            "Tudo do plano Controle",
            "Gestão de usuários e funcionários",
            "Controle de pedidos",
            "Gestão de localizações",
            "Dashboard com indicadores",
            "Gestão de fornecedores e clientes"
        ]
    },

    "inteligencia": {
        "id": "inteligencia",
        "nivel": "NÍVEL 03",
        "nome": "Inteligência",
        "descricao": "Tecnologia para operações avançadas",
        "preco": "149,90",
        "icone": "✦",
        "recursos": [
            "Tudo do plano Gestão",
            "Monitoramento por sensores",
            "Dados e indicadores em tempo real",
            "Controle inteligente do estoque",
            "Gestão completa da operação",
            "Estrutura preparada para automação"
        ]
    }
}


@app.route("/pagamento/<plano>")
def pagamento(plano):

    print("================================")
    print("PLANO RECEBIDO NA URL:", plano)
    print("================================")

    if plano not in PLANOS:
        return "Plano não encontrado", 404

    plano_selecionado = PLANOS[plano]

    return render_template(
        "pagamento.html",
        plano=plano_selecionado
    )

#processar pagamento

@app.route("/pagamento/processar", methods=["POST"])
def processar_pagamento():

    plano_id = request.form.get("plano", "").strip()
    nome = request.form.get("nome", "").strip()

    print("======================================")
    print("PLANO RECEBIDO:", repr(plano_id))
    print("NOME RECEBIDO:", repr(nome))
    print("FORMULÁRIO:", request.form)
    print("======================================")

    #validacoes

    if plano_id not in PLANOS:
        return "Plano inválido", 400

    if not nome:
        return "Nome obrigatório", 400

  #gerador de email

    primeiro_nome = nome.split()[0].lower()

    import unicodedata

    primeiro_nome = unicodedata.normalize(
        "NFD",
        primeiro_nome
    ).encode(
        "ascii",
        "ignore"
    ).decode("ascii")

    primeiro_nome = "".join(
        caractere
        for caractere in primeiro_nome
        if caractere.isalnum()
    )

    email = f"{primeiro_nome}@gmail.com"

    #senha#

    senha = "1234"

   #dados usuarios

    dados_usuario = {
        "nome": nome,
        "email": email,
        "senha": senha,
        "perfil": "cliente",
        "status": "ativo",
        "plano": plano_id
    }

    #cadastro banco
    try:

        usuario_id = usuarios_model.inserir_usuario(
            dados_usuario
        )

        print("======================================")
        print("USUÁRIO CADASTRADO COM SUCESSO!")
        print("ID:", usuario_id)
        print("NOME:", nome)
        print("EMAIL:", email)
        print("PLANO:", plano_id)
        print("======================================")

    except Exception as erro:

        print("======================================")
        print("ERRO AO CADASTRAR USUÁRIO!")
        print("ERRO:", repr(erro))
        print("======================================")

        return f"Erro ao cadastrar usuário: {erro}", 500

    #tela pagamento sucesso

    return render_template(
        "pagamento-sucesso.html",
        plano=PLANOS[plano_id],
        nome=nome,
        email=email,
        senha=senha
    )

@app.route("/dashboard")
@login_obrigatorio
def dashboard():

    total_produtos = produtos_model.contar()
    total_estoque = estoque_model.contar()
    total_entradas = pedido_entrada_model.contar()
    total_saidas = pedido_saida_model.contar()
    total_usuarios = usuarios_model.contar()
    total_sensores = sensores_model.contar()

    caminhao_model = CaminhaoModel()
    total_caminhoes = caminhao_model.contar()

    total_fornecedor = Fornecedor_model.contar()

    return render_template(
        "dashboard.html",
        total_produtos=total_produtos,
        total_estoque=total_estoque,
        total_entradas=total_entradas,
        total_saidas=total_saidas,
        total_usuarios=total_usuarios,
        total_sensores=total_sensores,
        total_caminhoes=total_caminhoes,
        total_fornecedor=total_fornecedor,
        alertas = alertas_estoque
    )

@app.route("/dashboard-gestao")
@login_obrigatorio
def dashboard_gestao():

    perfil = str(session.get("usuario_perfil", "")).strip().lower()
    plano = session.get("plano")

   
    if perfil != "cliente" or plano != "gestao":
        return redirect(url_for("dashboard"))

    total_produtos = produtos_model.contar()
    total_estoque = estoque_model.contar()
    total_entradas = pedido_entrada_model.contar()
    total_saidas = pedido_saida_model.contar()
    total_usuarios = usuarios_model.contar()
    total_sensores = sensores_model.contar()
    total_caminhoes = caminhoes_model.contar()
    total_fornecedor = Fornecedor_model.contar()

    return render_template(
        "dashboard_gestao.html",
        total_produtos=total_produtos,
        total_estoque=total_estoque,
        total_entradas=total_entradas,
        total_saidas=total_saidas,
        total_usuarios=total_usuarios,
        total_sensores=total_sensores,
        total_caminhoes=total_caminhoes,
        total_fornecedor=total_fornecedor
    )

#login e logout

@app.route("/login", methods=["GET", "POST"])
def login():

#email recebido do pagamento

    email_pre_preenchido = request.args.get("email", "")

#login#

    if request.method == "POST":

        email = request.form.get("email", "").strip()
        senha = request.form.get("senha", "")

        usuario = usuarios_model.autenticar(email, senha)

        print("USUARIO:", usuario)

#usuario encontrado

        if usuario:

#dados basicos da session

            session["usuario_id"] = usuario["id_usuario"]
            session["usuario_nome"] = usuario["nome"]
            session["usuario_perfil"] = usuario["perfil"]
            session["usuario_email"] = usuario["email"]

#plano usuario

            plano = usuario.get("plano")

            if plano:
                session["plano"] = plano

            perfil = str(
                usuario["perfil"]
            ).strip().lower()

            print("PERFIL:", perfil)
            print("PLANO:", plano)

#login realizado

            flash(
                "Login realizado com sucesso!",
                "success"
            )

            notificacao_model.criar(
                "Login realizado",
                "Você entrou no sistema."
            )

#cliente

            if perfil == "cliente":

#plano inteligencia- sistema completo

                if plano == "inteligencia":

                    return redirect(
                        url_for("dashboard")
                    )

#plano gestao

                if plano == "gestao":

                    return redirect(
                        url_for("dashboard_gestao")
                    )
#plano controle

                return redirect(
                    url_for("area_cliente")
                )

#funcionario/admin

            return redirect(
                url_for("dashboard")
            )
#login invalido

        flash(
            "E-mail ou senha inválidos.",
            "danger"
        )

#tela de login

    return render_template(
        "login.html",
        email=email_pre_preenchido
    )

def login_obrigatorio(funcao):
    @wraps(funcao)
    def wrapper(*args, **kwargs):

        if "usuario_id" not in session:
            flash("Faça login para acessar o sistema.", "warning")
            return redirect(url_for("login"))

        return funcao(*args, **kwargs)

    return wrapper


@app.route("/logout")
def logout():
    session.clear()
    flash("Você saiu do sistema.", "info")
    return redirect(url_for("login"))

#usuarios#

@app.route("/usuarios")
@login_obrigatorio
def listar_usuarios():
    usuarios = usuarios_model.listar()
    return render_template("usuarios/listar.html", usuarios=usuarios)


@app.route("/usuarios/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_usuario():
    if request.method == "POST":
        dados = {
            "nome": request.form.get("nome"),
            "email": request.form.get("email"),
            "senha": request.form.get("senha"),
            "perfil": request.form.get("perfil"),
            "status": request.form.get("status", "ativo")
        }

        usuarios_model.inserir_usuario(dados)

        notificacao_model.criar(
            "Novo usuário",
            f"Você cadastrou um novo usuário: {dados['nome']}."
        )

        flash("Usuário cadastrado com sucesso!", "success")
        return redirect(url_for("listar_usuarios"))

    return render_template("usuarios/form.html", usuario=None)


@app.route("/usuarios/editar/<int:id_usuario>", methods=["GET", "POST"])
@login_obrigatorio
def editar_usuario(id_usuario):
    usuario = usuarios_model.buscar_por_id(id_usuario)

    if request.method == "POST":
        dados = {
            "nome": request.form.get("nome"),
            "email": request.form.get("email"),
            "senha": request.form.get("senha"),
            "perfil": request.form.get("perfil"),
            "status": request.form.get("status")
        }

        usuarios_model.atualizar_usuario(id_usuario, dados)

        notificacao_model.criar(
            "Usuário alterado",
            f"Você alterou o usuário: {dados['nome']}."
        )

        flash("Usuário atualizado com sucesso!", "success")
        return redirect(url_for("listar_usuarios"))

    return render_template("usuarios/form.html", usuario=usuario)


@app.route("/usuarios/excluir/<int:id_usuario>")
@login_obrigatorio
def excluir_usuario(id_usuario):
    usuario_excluido = usuarios_model.buscar_por_id(id_usuario)

    usuarios_model.excluir(id_usuario)

    if usuario_excluido:
        nome_usuario = usuario_excluido["nome"]
    else:
        nome_usuario = "usuário"

    notificacao_model.criar(
        "Usuário excluído",
        f"Você excluiu o usuário: {nome_usuario}."
    )

    flash("Usuário excluído com sucesso!", "success")
    return redirect(url_for("listar_usuarios"))

#produtos

@app.route("/produtos")
@login_obrigatorio
def listar_produtos():

    produtos = produtos_model.listar()

    return render_template("produtos/listar.html", produtos=produtos)


@app.route("/produtos/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_produto():

    if request.method == "POST":

        arquivo = request.files.get("imagem")

        imagem_nome = None
        imagem_tipo = None
        imagem_blob = None

        if arquivo and arquivo.filename != "":

            if not imagem_permitida(arquivo.content_type):
                flash(
                    "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.",
                    "danger"
                )

                return redirect(url_for("novo_produto"))

            imagem_nome = arquivo.filename
            imagem_tipo = arquivo.content_type
            imagem_blob = arquivo.read()

        dados = {
            "codigo": request.form.get("codigo"),
            "nome": request.form.get("nome"),
            "descricao": request.form.get("descricao"),
            "unidade_medida": request.form.get("unidade_medida"),
            "estoque_minimo": request.form.get("estoque_minimo"),
            "estoque_maximo": request.form.get("estoque_maximo"),
            "status": request.form.get("status", "ativo"),
            "imagem_nome": imagem_nome,
            "imagem_tipo": imagem_tipo,
            "imagem_blob": imagem_blob
        }

        produtos_model.inserir(dados)

        notificacao_model.criar(
            "Novo produto",
            f"Você cadastrou um novo produto: {dados['nome']}."
        )

        flash("Produto cadastrado com sucesso!", "success")

        return redirect(url_for("listar_produtos"))

    return render_template("produtos/form.html", produto=None)


@app.route("/produtos/editar/<int:id_produto>", methods=["GET", "POST"])
@login_obrigatorio
def editar_produto(id_produto):

    produto = produtos_model.buscar_por_id_com_imagem(id_produto)

    if request.method == "POST":

        arquivo = request.files.get("imagem")

        imagem_nome = produto["imagem_nome"]
        imagem_tipo = produto["imagem_tipo"]
        imagem_blob = produto["imagem_blob"]

        if arquivo and arquivo.filename != "":

            if not imagem_permitida(arquivo.content_type):
                flash(
                    "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.",
                    "danger"
                )

                return redirect(
                    url_for("editar_produto", id_produto=id_produto)
                )

            imagem_nome = arquivo.filename
            imagem_tipo = arquivo.content_type
            imagem_blob = arquivo.read()

        dados = {
            "codigo": request.form.get("codigo"),
            "nome": request.form.get("nome"),
            "descricao": request.form.get("descricao"),
            "unidade_medida": request.form.get("unidade_medida"),
            "estoque_minimo": request.form.get("estoque_minimo"),
            "estoque_maximo": request.form.get("estoque_maximo"),
            "status": request.form.get("status"),
            "imagem_nome": imagem_nome,
            "imagem_tipo": imagem_tipo,
            "imagem_blob": imagem_blob
        }

        produtos_model.atualizar(id_produto, dados)

        notificacao_model.criar(
            "Produto alterado",
            f"Você alterou o produto: {dados['nome']}."
        )

        flash("Produto atualizado com sucesso!", "success")

        return redirect(url_for("listar_produtos"))

    return render_template("produtos/form.html", produto=produto)


@app.route("/produtos/excluir/<int:id_produto>", methods=["POST"])
@login_obrigatorio
def excluir_produto(id_produto):

    try:

        produto_model = ProdutoModel()

        produto = produto_model.buscar_por_id_com_imagem(id_produto)

        produto_model.excluir(id_produto)

        if produto:
            nome_produto = produto["nome"]
        else:
            nome_produto = "produto"

        notificacao_model.criar(
            "Produto excluído",
            f"Você excluiu o produto: {nome_produto}."
        )

        flash(
            "Produto excluído com sucesso!",
            "success"
        )

    except Exception:

        flash(
            "Não foi possível excluir este produto porque ele está vinculado ao estoque, pedidos ou movimentações.",
            "danger"
        )

    return redirect(
        url_for("listar_produtos")
    )



#localizacoes

@app.route("/localizacoes")
@login_obrigatorio
def listar_localizacoes():
    localizacoes = localizacoes_model.listar()
    return render_template("localizacoes/listar.html", localizacoes=localizacoes)


@app.route("/localizacoes/novo", methods=["GET", "POST"])
@login_obrigatorio
def nova_localizacao():
    if request.method == "POST":
        dados = {
            "nome": request.form.get("nome"),
            "setor": request.form.get("setor"),
            "corredor": request.form.get("corredor"),
            "prateleira": request.form.get("prateleira"),
            "observacao": request.form.get("observacao")
        }

        localizacoes_model.inserir(dados)

        notificacao_model.criar(
            "Nova localização",
            f"Você cadastrou uma nova localização: {dados['nome']}."
        )

        flash("Localização cadastrada com sucesso!", "success")
        return redirect(url_for("listar_localizacoes"))

    return render_template("localizacoes/form.html", localizacao=None)


@app.route("/localizacoes/editar/<int:id_localizacao>", methods=["GET", "POST"])
@login_obrigatorio
def editar_localizacao(id_localizacao):
    localizacao = localizacoes_model.buscar_por_id(id_localizacao)

    if request.method == "POST":
        dados = {
            "nome": request.form.get("nome"),
            "setor": request.form.get("setor"),
            "corredor": request.form.get("corredor"),
            "prateleira": request.form.get("prateleira"),
            "observacao": request.form.get("observacao")
        }

        localizacoes_model.atualizar(id_localizacao, dados)

        notificacao_model.criar(
            "Localização alterada",
            f"Você alterou a localização: {dados['nome']}."
        )

        flash("Localização atualizada com sucesso!", "success")
        return redirect(url_for("listar_localizacoes"))

    return render_template("localizacoes/form.html", localizacao=localizacao)


@app.route("/localizacoes/excluir/<int:id_localizacao>", methods=["POST"])
@login_obrigatorio
def excluir_localizacao(id_localizacao):
    localizacao = localizacoes_model.buscar_por_id(id_localizacao)

    localizacoes_model.excluir(id_localizacao)

    if localizacao:
        nome_localizacao = localizacao["nome"]
    else:
        nome_localizacao = "localização"

    notificacao_model.criar(
        "Localização excluída",
        f"Você excluiu a localização: {nome_localizacao}."
    )

    flash("Localização excluída com sucesso!", "success")
    return redirect(url_for("listar_localizacoes"))


#estoque

@app.route("/estoque")
@login_obrigatorio
def listar_estoque():
    estoque = estoque_model.listar_completo()
    return render_template("estoque/listar.html", estoque=estoque)


#sensores

@app.route("/sensores")
@login_obrigatorio
def listar_sensores():
    sensores = sensores_model.listar()
    return render_template("sensores/listar.html", sensores=sensores)


@app.route("/sensores/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_sensor():
    produtos = produtos_model.listar()
    localizacoes = localizacoes_model.listar()

    if request.method == "POST":
        id_produto = request.form.get("id_produto")

        if id_produto == "":
            id_produto = None

        dados = {
            "nome": request.form.get("nome"),
            "tipo_sensor": request.form.get("tipo_sensor"),
            "codigo_sensor": request.form.get("codigo_sensor"),
            "id_localizacao": request.form.get("id_localizacao"),
            "id_produto": id_produto,
            "status": request.form.get("status", "ativo")
        }

        sensores_model.inserir(dados)

        notificacao_model.criar(
            "Novo sensor",
            f"Você cadastrou um novo sensor: {dados['nome']}."
        )

        flash("Sensor cadastrado com sucesso!", "success")
        return redirect(url_for("listar_sensores"))

    return render_template(
        "sensores/form.html",
        sensor=None,
        produtos=produtos,
        localizacoes=localizacoes
    )


@app.route("/sensores/editar/<int:id_sensor>", methods=["GET", "POST"])
@login_obrigatorio
def editar_sensor(id_sensor):
    sensor = sensores_model.buscar_por_id(id_sensor)
    produtos = produtos_model.listar()
    localizacoes = localizacoes_model.listar()

    if request.method == "POST":
        id_produto = request.form.get("id_produto")

        if id_produto == "":
            id_produto = None

        dados = {
            "nome": request.form.get("nome"),
            "tipo_sensor": request.form.get("tipo_sensor"),
            "codigo_sensor": request.form.get("codigo_sensor"),
            "id_localizacao": request.form.get("id_localizacao"),
            "id_produto": id_produto,
            "status": request.form.get("status")
        }

        sensores_model.atualizar(id_sensor, dados)

        notificacao_model.criar(
            "Sensor alterado",
            f"Você alterou o sensor: {dados['nome']}."
        )

        flash("Sensor atualizado com sucesso!", "success")
        return redirect(url_for("listar_sensores"))

    return render_template(
        "sensores/form.html",
        sensor=sensor,
        produtos=produtos,
        localizacoes=localizacoes
    )


@app.route("/sensores/excluir/<int:id_sensor>")
@login_obrigatorio
def excluir_sensor(id_sensor):
    sensor = sensores_model.buscar_por_id(id_sensor)

    sensores_model.excluir(id_sensor)

    if sensor:
        nome_sensor = sensor["nome"]
    else:
        nome_sensor = "sensor"

    notificacao_model.criar(
        "Sensor excluído",
        f"Você excluiu o sensor: {nome_sensor}."
    )

    flash("Sensor excluído com sucesso!", "success")
    return redirect(url_for("listar_sensores"))

#pedido entrada

@app.route("/pedidos-entrada")
@login_obrigatorio
def listar_pedidos_entrada():
    pedidos = pedido_entrada_model.listar()
    return render_template("pedidos_entrada/listar.html", pedidos=pedidos)


@app.route("/pedidos-entrada/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_pedido_entrada():
    fornecedores = Fornecedor_model.listar()
    produtos = produtos_model.listar()
    localizacoes = localizacoes_model.listar()

    if request.method == "POST":
        cabecalho = {
            "numero_documento": request.form.get("numero_documento"),
            "id_fornecedor": request.form.get("id_fornecedor"),
            "data_entrada": request.form.get("data_entrada"),
            "id_usuario": session["usuario_id"],
            "observacao": request.form.get("observacao"),
            "status": "finalizado"
        }

        produtos_form = request.form.getlist("id_produto[]")
        localizacoes_form = request.form.getlist("id_localizacao[]")
        quantidades_form = request.form.getlist("quantidade[]")
        valores_form = request.form.getlist("valor_unitario[]")

        itens = []

        for i in range(len(produtos_form)):
            if produtos_form[i] and localizacoes_form[i] and quantidades_form[i]:
                item = {
                    "id_produto": produtos_form[i],
                    "id_localizacao": localizacoes_form[i],
                    "quantidade": quantidades_form[i],
                    "valor_unitario": valores_form[i]
                }

                itens.append(item)

        if len(itens) == 0:
            flash("Adicione pelo menos um item ao pedido.", "warning")
            return redirect(url_for("novo_pedido_entrada"))

        try:
            pedido_entrada_model.inserir_com_itens(cabecalho, itens)

            notificacao_model.criar(
                "Novo pedido de entrada",
                f"Você cadastrou o pedido de entrada: {cabecalho['numero_documento']}."
            )

            flash("Pedido de entrada cadastrado com sucesso!", "success")
            return redirect(url_for("listar_pedidos_entrada"))

        except Exception as erro:
            flash(f"Erro ao cadastrar pedido de entrada: {erro}", "danger")

    return render_template(
        "pedidos_entrada/form.html",
        produtos=produtos,
        localizacoes=localizacoes,
        fornecedores=fornecedores
    )


@app.route("/pedidos-entrada/visualizar/<int:id_pedido_entrada>")
@login_obrigatorio
def visualizar_pedido_entrada(id_pedido_entrada):
    pedido = pedido_entrada_model.buscar_com_itens(id_pedido_entrada)

    return render_template(
        "pedidos_entrada/visualizar.html",
        pedido=pedido
    )
#pedido saida

@app.route("/pedidos-saida")
@login_obrigatorio
def listar_pedidos_saida():
    pedidos = pedido_saida_model.listar()
    return render_template("pedidos_saida/listar.html", pedidos=pedidos)


@app.route("/pedidos-saida/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_pedido_saida():
    produtos = produtos_model.listar()
    localizacoes = localizacoes_model.listar()
    listar_caminhoes = caminhoes_model.listar()

    if request.method == "POST":
        cabecalho = {
            "numero_documento": request.form.get("numero_documento"),
            "solicitante": request.form.get("solicitante"),
            "data_saida": request.form.get("data_saida"),
            "id_usuario": session["usuario_id"],
            "observacao": request.form.get("observacao"),
            "id_caminhao": request.form.get("id_caminhao"),
            "status": "finalizado"
        }

        produtos_form = request.form.getlist("id_produto[]")
        localizacoes_form = request.form.getlist("id_localizacao[]")
        quantidades_form = request.form.getlist("quantidade[]")

        itens = []

        for i in range(len(produtos_form)):
            if produtos_form[i] and localizacoes_form[i] and quantidades_form[i]:
                item = {
                    "id_produto": produtos_form[i],
                    "id_localizacao": localizacoes_form[i],
                    "quantidade": quantidades_form[i]
                }

                itens.append(item)

        if len(itens) == 0:
            flash("Adicione pelo menos um item ao pedido.", "warning")
            return redirect(url_for("novo_pedido_saida"))

        try:
            pedido_saida_model.inserir_com_itens(cabecalho, itens)

            notificacao_model.criar(
                "Novo pedido de saída",
                f"Você cadastrou o pedido de saída: {cabecalho['numero_documento']}."
            )

            flash("Pedido de saída cadastrado com sucesso!", "success")
            return redirect(url_for("listar_pedidos_saida"))

        except Exception as erro:
            flash(f"Erro ao cadastrar pedido de saída: {erro}", "danger")

    return render_template(
        "pedidos_saida/form.html",
        produtos=produtos,
        localizacoes=localizacoes,
        caminhoes=listar_caminhoes
    )


@app.route("/pedidos-saida/visualizar/<int:id_pedido_saida>")
@login_obrigatorio
def visualizar_pedido_saida(id_pedido_saida):
    pedido = pedido_saida_model.buscar_com_itens(id_pedido_saida)

    return render_template(
        "pedidos_saida/visualizar.html",
        pedido=pedido
    )


#endpoints mobile + api

@app.route("/api/login", methods=["POST"])
def api_login():
    dados = request.get_json()

    email = dados.get("email")
    senha = dados.get("senha")

    usuario = usuarios_model.autenticar(email, senha)

    if usuario:
        return jsonify({
            "ok": True,
            "mensagem": "Login realizado com sucesso.",
            "usuario": {
                "id_usuario": usuario["id_usuario"],
                "nome": usuario["nome"],
                "email": usuario["email"],
                "perfil": usuario["perfil"]
            }
        })

    return jsonify({
        "ok": False,
        "mensagem": "E-mail ou senha inválidos."
    }), 401


@app.route("/api/produtos", methods=["GET"])
def api_listar_produtos():
    produtos = produtos_model.listar()

    return jsonify({
        "ok": True,
        "produtos": produtos
    })


@app.route("/api/estoque", methods=["GET"])
def api_listar_estoque():
    estoque = estoque_model.listar_completo()

    return jsonify({
        "ok": True,
        "estoque": estoque
    })


@app.route("/api/sensores/dados", methods=["POST"])
def api_registrar_dados_sensor():
    dados = request.get_json()

    sensores_model.registrar_dados_sensor(dados)

    return jsonify({
        "ok": True,
        "mensagem": "Dados do sensor registrados com sucesso."
    })


#execucao


@app.route("/pedidos-entrada/editar/<int:id_pedido_entrada>", methods=["GET", "POST"])
@login_obrigatorio
def editar_pedido_entrada(id_pedido_entrada):
    fornecedores = Fornecedor_model.listar()
    produtos = produtos_model.listar()
    localizacoes = localizacoes_model.listar()
    pedido = pedido_entrada_model.buscar_com_itens(id_pedido_entrada)

    if request.method == "POST":
        cabecalho = {
            "numero_documento": request.form.get("numero_documento"),
            "id_fornecedor": request.form.get("id_fornecedor"),
            "data_entrada": request.form.get("data_entrada"),
            "observacao": request.form.get("observacao"),
            "status": "finalizado"
        }

        produtos_form = request.form.getlist("id_produto[]")
        localizacoes_form = request.form.getlist("id_localizacao[]")
        quantidades_form = request.form.getlist("quantidade[]")
        valores_form = request.form.getlist("valor_unitario[]")

        itens = []

        for i in range(len(produtos_form)):
            if produtos_form[i] and localizacoes_form[i] and quantidades_form[i]:
                itens.append({
                    "id_produto": produtos_form[i],
                    "id_localizacao": localizacoes_form[i],
                    "quantidade": quantidades_form[i],
                    "valor_unitario": valores_form[i]
                })

        if len(itens) == 0:
            flash("Adicione pelo menos um item ao pedido.", "warning")
            return redirect(url_for("editar_pedido_entrada", id_pedido_entrada=id_pedido_entrada))

        try:
            pedido_entrada_model.atualizar_com_itens(
                id_pedido_entrada,
                cabecalho,
                itens
            )

            notificacao_model.criar(
                "Pedido de entrada alterado",
                f"Você alterou o pedido de entrada: {cabecalho["numero_documento"]}."
            )

            flash("Pedido de entrada atualizado com sucesso!", "success")
            return redirect(url_for("listar_pedidos_entrada"))

        except Exception as erro:
            flash(f"Erro ao atualizar pedido de entrada: {erro}", "danger")

    return render_template(
    "pedidos_entrada/form.html",
    produtos=produtos,
    localizacoes=localizacoes,
    fornecedores=fornecedores,
    pedido=pedido
)
    


@app.route("/pedidos-saida/editar/<int:id_pedido_saida>", methods=["GET", "POST"])
@login_obrigatorio
def editar_pedido_saida(id_pedido_saida):
    produtos = produtos_model.listar()
    localizacoes = localizacoes_model.listar()
    pedido = pedido_saida_model.buscar_com_itens(id_pedido_saida)
    caminhoes = caminhoes_model.listar()
    

    if request.method == "POST":
        cabecalho = {
            "numero_documento": request.form.get("numero_documento"),
            "solicitante": request.form.get("solicitante"),
            "data_saida": request.form.get("data_saida"),
            "observacao": request.form.get("observacao"),
            "id_caminhao": request.form.get("id_caminhao"),
            "status": "finalizado"
        }

        produtos_form = request.form.getlist("id_produto[]")
        localizacoes_form = request.form.getlist("id_localizacao[]")
        quantidades_form = request.form.getlist("quantidade[]")

        itens = []

        for i in range(len(produtos_form)):
            if produtos_form[i] and localizacoes_form[i] and quantidades_form[i]:
                itens.append({
                    "id_produto": produtos_form[i],
                    "id_localizacao": localizacoes_form[i],
                    "quantidade": quantidades_form[i]
                })

        if len(itens) == 0:
            flash("Adicione pelo menos um item ao pedido.", "warning")
            return redirect(url_for("editar_pedido_saida", id_pedido_saida=id_pedido_saida))

        try:
            pedido_saida_model.atualizar_com_itens(
                id_pedido_saida,
                cabecalho,
                itens
            )

            notificacao_model.criar(
                "Pedido de saída alterado",
                f"Você alterou o pedido de saída: {cabecalho["numero_documento"]}."
            )

            flash("Pedido de saída atualizado com sucesso!", "success")
            return redirect(url_for("listar_pedidos_saida"))

        except Exception as erro:
            flash(f"Erro ao atualizar pedido de saída: {erro}", "danger")

    return render_template(
        "pedidos_saida/form.html",
        produtos=produtos,
        localizacoes=localizacoes,
        caminhoes=caminhoes,
        pedido=pedido
    )


#caminhao

@app.route("/caminhoes")
@login_obrigatorio
def listar_caminhoes():
    caminhoes = caminhoes_model.listar()
    return render_template("caminhao/listar.html", caminhoes=caminhoes)


@app.route("/caminhoes/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_caminhao():
    if request.method == "POST":
        arquivo = request.files.get("imagem")

        imagem_nome = None
        imagem_tipo = None
        imagem_blob = None

        if arquivo and arquivo.filename != "":
            if not imagem_permitida(arquivo.content_type):
                flash(
                    "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.",
                    "danger"
                )
                return redirect(url_for("novo_caminhao"))

            imagem_nome = arquivo.filename
            imagem_tipo = arquivo.content_type
            imagem_blob = arquivo.read()

        dados = {
            "placa": request.form.get("placa"),
            "modelo": request.form.get("modelo"),
            "cor": request.form.get("cor"),
            "marca": request.form.get("marca"),
            "chassi": request.form.get("chassi"),
            "imagem_nome": imagem_nome,
            "imagem_tipo": imagem_tipo,
            "imagem_blob": imagem_blob
        }

        caminhoes_model.inserir(dados)

        notificacao_model.criar(
            "Novo caminhão",
            f"Você cadastrou um novo caminhão: {dados['placa']}."
        )

        flash(
            "Caminhão cadastrado com sucesso!",
            "success"
        )

        return redirect(url_for("listar_caminhoes"))

    return render_template(
        "caminhao/form.html",
        caminhao=None
    )


@app.route("/caminhoes/editar/<int:id_caminhao>", methods=["GET", "POST"])
@login_obrigatorio
def editar_caminhao(id_caminhao):
    caminhao_model = CaminhaoModel()

    caminhao = caminhao_model.buscar_por_id_com_imagem(
        id_caminhao
    )

    if request.method == "POST":
        arquivo = request.files.get("imagem")

        imagem_nome = caminhao["imagem_nome"]
        imagem_tipo = caminhao["imagem_tipo"]
        imagem_blob = caminhao["imagem_blob"]

        if arquivo and arquivo.filename != "":
            if not imagem_permitida(arquivo.content_type):
                flash(
                    "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.",
                    "danger"
                )
                return redirect(
                    url_for(
                        "editar_caminhao",
                        id_caminhao=id_caminhao
                    )
                )

            imagem_nome = arquivo.filename
            imagem_tipo = arquivo.content_type
            imagem_blob = arquivo.read()

        dados = {
            "placa": request.form.get("placa"),
            "modelo": request.form.get("modelo"),
            "cor": request.form.get("cor"),
            "marca": request.form.get("marca"),
            "chassi": request.form.get("chassi"),
            "imagem_nome": imagem_nome,
            "imagem_tipo": imagem_tipo,
            "imagem_blob": imagem_blob
        }

        caminhao_model.atualizar(
            id_caminhao,
            dados
        )

        notificacao_model.criar(
            "Caminhão alterado",
            f"Você alterou o caminhão: {dados['placa']}."
        )

        flash(
            "Caminhão atualizado com sucesso!",
            "success"
        )

        return redirect(url_for("listar_caminhoes"))

    return render_template(
        "caminhao/form.html",
        caminhao=caminhao
    )


@app.route("/caminhoes/excluir/<int:id_caminhao>")
@login_obrigatorio
def excluir_caminhao(id_caminhao):
    try:
        caminhao_model = CaminhaoModel()

        caminhao = caminhao_model.buscar_por_id_com_imagem(
            id_caminhao
        )

        caminhao_model.excluir(id_caminhao)

        if caminhao:
            placa_caminhao = caminhao["placa"]
        else:
            placa_caminhao = "caminhão"

        notificacao_model.criar(
            "Caminhão excluído",
            f"Você excluiu o caminhão: {placa_caminhao}."
        )

        flash(
            "Caminhão excluído com sucesso!",
            "success"
        )

    except Exception:
        flash(
            "Não foi possível excluir esse caminhão porque ele está vinculado a saída de produtos",
            "danger"
        )

    return redirect(
        url_for("listar_caminhoes")
    )

#fornecedores

@app.route("/fornecedores")
@login_obrigatorio
def listar_fornecedor():
    fornecedores = Fornecedor_model.listar()
    return render_template(
        "fornecedores/listar.html",
        fornecedores=fornecedores
    )


@app.route("/fornecedores/novo", methods=["GET", "POST"])
@login_obrigatorio
def novo_fornecedor():
    if request.method == "POST":
        dados = {
            "nome": request.form.get("nome"),
            "cnpj": request.form.get("cnpj"),
            "email": request.form.get("email"),
            "telefone": request.form.get("telefone"),
            "endereco": request.form.get("endereco"),
            "cep": request.form.get("cep"),
            "contato_responsavel": request.form.get("contato_responsavel"),
            "status": request.form.get("status"),
            "observacoes": request.form.get("observacoes")
        }

        if not dados["email"]:
            flash("O campo Email é obrigatório.", "danger")
            return redirect(url_for("novo_fornecedor"))

        Fornecedor_model.inserir(dados)

        notificacao_model.criar(
            "Novo fornecedor",
            f"Você cadastrou um novo fornecedor: {dados['nome']}."
        )

        flash("Fornecedor cadastrado com sucesso!", "success")
        return redirect(url_for("listar_fornecedor"))

    return render_template(
        "fornecedores/form.html",
        fornecedor=None
    )


@app.route("/fornecedores/editar/<int:id_fornecedor>", methods=["GET", "POST"])
@login_obrigatorio
def editar_fornecedor(id_fornecedor):
    fornecedor = Fornecedor_model.buscar_por_id(id_fornecedor)

    if request.method == "POST":
        dados = {
            "nome": request.form.get("nome"),
            "cnpj": request.form.get("cnpj"),
            "email": request.form.get("email"),
            "telefone": request.form.get("telefone"),
            "endereco": request.form.get("endereco"),
            "cep": request.form.get("cep"),
            "contato_responsavel": request.form.get("contato_responsavel"),
            "status": request.form.get("status"),
            "observacoes": request.form.get("observacoes")
        }

        if not dados["email"]:
            flash("O campo Email é obrigatório.", "danger")
            return redirect(
                url_for(
                    "editar_fornecedor",
                    id_fornecedor=id_fornecedor
                )
            )

        Fornecedor_model.atualizar(id_fornecedor, dados)

        notificacao_model.criar(
            "Fornecedor alterado",
            f"Você alterou o fornecedor: {dados['nome']}."
        )

        flash("Fornecedor atualizado com sucesso!", "success")
        return redirect(url_for("listar_fornecedor"))

    return render_template(
        "fornecedores/form.html",
        fornecedor=fornecedor
    )


@app.route("/fornecedores/excluir/<int:id_fornecedor>")
@login_obrigatorio
def excluir_fornecedor(id_fornecedor):
    fornecedor = Fornecedor_model.buscar_por_id(id_fornecedor)

    Fornecedor_model.excluir(id_fornecedor)

    if fornecedor:
        nome_fornecedor = fornecedor["nome"]
    else:
        nome_fornecedor = "fornecedor"

    notificacao_model.criar(
        "Fornecedor excluído",
        f"Você excluiu o fornecedor: {nome_fornecedor}."
    )

    flash("Fornecedor excluído com sucesso!", "success")
    return redirect(url_for("listar_fornecedor"))

#Notificação

@app.route("/notificacoes")
@login_obrigatorio
def notificacoes():

    lista_notificacoes = notificacao_model.listar()

    quantidade = notificacao_model.contar_nao_lidas()

    return render_template(
        "notificacoes.html",
        notificacoes=lista_notificacoes,
        quantidade=quantidade
    )



@app.route("/notificacoes/lida/<int:id_notificacao>")
@login_obrigatorio
def notificacao_lida(id_notificacao):

    notificacao_model.marcar_como_lida(id_notificacao)

    return redirect("/notificacoes")


@app.route("/notificacoes/ler-todas")
@login_obrigatorio
def notificacoes_ler_todas():

    notificacao_model.marcar_todas_como_lidas()

    return redirect("/notificacoes")

@app.route("/mapa-estoque")
@login_obrigatorio
def mapa_estoque():
    localizacoes = localizacoes_model.listar()

    return render_template(
        "mapa_estoque.html",
        localizacoes=localizacoes
    )


#configurações

@app.route('/configuracoes')
def configuracoes():
    return render_template('configuracao.html')

if __name__ == "__main__":
    app.run(debug=True)