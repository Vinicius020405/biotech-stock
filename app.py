from flask import Flask, jsonify, request
from conectar import connect_db


from inserir import (
    insert_funcionario, insert_cliente, insert_fornecedor, insert_itemEntrada,
    inserir_itemsaida, inserir_localizacao, inserir_pedido_entrada
)

from consultar import (
    read_funcionario, read_clientes, read_fornecedores, read_itemEntrada,
    consultar_itemsaida, consultar_localizacao, consultar_pedido_entrada
)

from atualizar import (
    update_funcionario, update_cliente, update_fornecedor, update_itemEntrada,
    atualizar_itemsaida, atualizar_localizacao, atualizar_pedido_entrada
)

from deletar import (
    deleta_funcionario, deleta_cliente, deleta_fornecedor, deleta_itemEntrada,
    deletar_itemsaida, deletar_localizacao, deletar_pedido_entrada
)



from inserir import inserir_pedido_saida
from consultar import consultar_pedido_saida
from atualizar import atualizar_pedido_saida
from deletar import deletar_pedido_saida

# ============================
# MÓDULO - Produto
# ============================

from inserir import inserir_produto
from consultar import consultar_produto
from atualizar import atualizar_produto
from deletar import deletar_produto

# ============================
# MÓDULO - Sensor
# ============================

from inserir import inserir_sensor
from consultar import consultar_sensor
from atualizar import atualizar_sensor
from deletar import deletar_sensor

# ============================
# MÓDULO - Transportadora
# ============================

from inserir import inserir_transportadora
from consultar import consultar_transportadora
from atualizar import atualizar_transportadora
from deletar import deletar_transportadora

# ============================
# INICIALIZAÇÃO DO APP
# ============================

app = Flask(__name__)

# ============================================================
# FUNCIONÁRIO
# ============================================================

@app.route('/funcionario', methods=['POST'])
def add_funcionario():
    return jsonify(insert_funcionario(request.json)), 201

@app.route('/funcionario', methods=['GET'])
def get_funcionarios():
    return jsonify(read_funcionario()), 200

@app.route('/funcionario/<int:id>', methods=['GET'])
def get_funcionario_by_id(id):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM funcionario WHERE id_funcionario=%s", (id,))
    dados = cur.fetchone()
    cur.close()
    conn.close()
    if dados:
        return jsonify(dados)
    return jsonify({'erro': 'Funcionário não encontrado'}), 404

@app.route('/funcionario', methods=['PUT'])
def edit_funcionario():
    return jsonify(update_funcionario(request.json)), 200

@app.route('/funcionario/<int:id>', methods=['DELETE'])
def delete_funcionario(id):
    return jsonify(deleta_funcionario(id)), 200


# ============================================================
# CLIENTE
# ============================================================

@app.route('/cliente', methods=['POST'])
def add_cliente():
    return jsonify(insert_cliente(request.json)), 201

@app.route('/cliente', methods=['GET'])
def get_clientes():
    return jsonify(read_clientes()), 200

@app.route('/cliente/<int:id>', methods=['GET'])
def get_cliente_by_id(id):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM cliente WHERE id_cliente=%s", (id,))
    dados = cur.fetchone()
    cur.close()
    conn.close()
    if dados:
        return jsonify(dados)
    return jsonify({'erro': 'Cliente não encontrado'}), 404

@app.route('/cliente', methods=['PUT'])
def edit_cliente():
    return jsonify(update_cliente(request.json)), 200

@app.route('/cliente/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    return jsonify(deleta_cliente(id)), 200


# ============================================================
# FORNECEDOR
# ============================================================

@app.route('/fornecedor', methods=['POST'])
def add_fornecedor():
    return jsonify(insert_fornecedor(request.json)), 201

@app.route('/fornecedor', methods=['GET'])
def get_fornecedores():
    return jsonify(read_fornecedores()), 200

@app.route('/fornecedor/<int:id>', methods=['GET'])
def get_fornecedor_by_id(id):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM fornecedor WHERE id_fornecedor=%s", (id,))
    dados = cur.fetchone()
    cur.close()
    conn.close()
    if dados:
        return jsonify(dados)
    return jsonify({'erro': 'Fornecedor não encontrado'}), 404

@app.route('/fornecedor', methods=['PUT'])
def edit_fornecedor():
    return jsonify(update_fornecedor(request.json)), 200

@app.route('/fornecedor/<int:id>', methods=['DELETE'])
def delete_fornecedor(id):
    return jsonify(deleta_fornecedor(id)), 200


# ============================================================
# ITEM ENTRADA
# ============================================================

@app.route('/itementrada', methods=['POST'])
def add_itementrada():
    return jsonify(insert_itemEntrada(request.json)), 201

@app.route('/itementrada', methods=['GET'])
def get_itementrada():
    return jsonify(read_itemEntrada()), 200

@app.route('/itementrada/<int:id>', methods=['GET'])
def get_itementrada_by_id(id):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM itementrada WHERE id_itemEntrada=%s", (id,))
    dados = cur.fetchone()
    cur.close()
    conn.close()
    if dados:
        return jsonify(dados)
    return jsonify({'erro': 'ItemEntrada não encontrado'}), 404

@app.route('/itementrada', methods=['PUT'])
def edit_itementrada():
    return jsonify(update_itemEntrada(request.json)), 200

@app.route('/itementrada/<int:id>', methods=['DELETE'])
def delete_itementrada(id):
    return jsonify(deleta_itemEntrada(id)), 200


# ============================================================
# ITEM SAIDA
# ============================================================

@app.route('/itemsaida', methods=['POST'])
def add_itemsaida():
    return jsonify(inserir_itemsaida(request.json)), 201

@app.route('/itemsaida', methods=['GET'])
def get_itemsaida_entries():
    return jsonify(consultar_itemsaida()), 200

@app.route('/itemsaida/<int:id>', methods=['PUT'])
def edit_itemsaida(id):
    return jsonify(atualizar_itemsaida(id, request.json)), 200

@app.route('/itemsaida/<int:id>', methods=['DELETE'])
def delete_itemsaida(id):
    return jsonify(deletar_itemsaida(id)), 200


# ============================================================
# LOCALIZAÇÃO
# ============================================================

@app.route('/localizacao', methods=['POST'])
def add_localizacao():
    return jsonify(inserir_localizacao(request.json)), 201

@app.route('/localizacao', methods=['GET'])
def get_localizacao():
    return jsonify(consultar_localizacao()), 200

@app.route('/localizacao/<int:id>', methods=['PUT'])
def edit_localizacao(id):
    return jsonify(atualizar_localizacao(id, request.json)), 200

@app.route('/localizacao/<int:id>', methods=['DELETE'])
def delete_localizacao(id):
    return jsonify(deletar_localizacao(id)), 200


# ============================================================
# PEDIDO ENTRADA
# ============================================================

@app.route('/pedido_entrada', methods=['POST'])
def add_pedidoentrada():
    return jsonify(inserir_pedido_entrada(request.json)), 201

@app.route('/pedido_entrada', methods=['GET'])
def get_pedidoentrada():
    return jsonify(consultar_pedido_entrada()), 200

@app.route('/pedido_entrada/<int:id>', methods=['PUT'])
def edit_pedidoentrada(id):
    return jsonify(atualizar_pedido_entrada(id, request.json)), 200

@app.route('/pedido_entrada/<int:id>', methods=['DELETE'])
def delete_pedidoentrada(id):
    return jsonify(deletar_pedido_entrada(id)), 200


# ============================================================
# PEDIDO SAIDA
# ============================================================

@app.route('/pedido_saida', methods=['POST'])
def add_pedidosaida():
    return jsonify(inserir_pedido_saida(request.json)), 201

@app.route('/pedido_saida', methods=['GET'])
def get_pedidosaida():
    return jsonify(consultar_pedido_saida()), 200

@app.route('/pedido_saida/<int:id>', methods=['PUT'])
def edit_pedidosaida(id):
    return jsonify(atualizar_pedido_saida(id, request.json)), 200

@app.route('/pedido_saida/<int:id>', methods=['DELETE'])
def delete_pedidosaida(id):
    return jsonify(deletar_pedido_saida(id)), 200


# ============================================================
# PRODUTO
# ============================================================

@app.route('/produto', methods=['POST'])
def add_produto():
    return jsonify(inserir_produto(request.json)), 201

@app.route('/produto', methods=['GET'])
def get_produtos():
    return jsonify(consultar_produto()), 200

@app.route('/produto/<int:id>', methods=['PUT'])
def edit_produto(id):
    return jsonify(atualizar_produto(id, request.json)), 200

@app.route('/produto/<int:id>', methods=['DELETE'])
def delete_produto(id):
    return jsonify(deletar_produto(id)), 200


# ============================================================
# SENSOR
# ============================================================

@app.route('/sensor', methods=['POST'])
def add_sensor():
    return jsonify(inserir_sensor(request.json)), 201

@app.route('/sensor', methods=['GET'])
def get_sensores():
    return jsonify(consultar_sensor()), 200

@app.route('/sensor/<int:id>', methods=['PUT'])
def edit_sensor(id):
    return jsonify(atualizar_sensor(id, request.json)), 200

@app.route('/sensor/<int:id>', methods=['DELETE'])
def delete_sensor(id):
    return jsonify(deletar_sensor(id)), 200


# ============================================================
# TRANSPORTADORA
# ============================================================

@app.route('/transportadora', methods=['POST'])
def add_transportadora():
    return jsonify(inserir_transportadora(request.json)), 201

@app.route('/transportadora', methods=['GET'])
def get_transportadoras():
    return jsonify(consultar_transportadora()), 200

@app.route('/transportadora/<int:id>', methods=['PUT'])
def edit_transportadora(id):
    return jsonify(atualizar_transportadora(id, request.json)), 200

@app.route('/transportadora/<int:id>', methods=['DELETE'])
def delete_transportadora(id):
    return jsonify(deletar_transportadora(id)), 200


# ============================
# EXECUTAR API
# ============================

import requests
from validar import (
    validar_id_transportadora,
    validar_nome_transportadora,
    validar_sensor,
    validar_tipo_sensor,
    validar_descricao,
    validar_id_item,
    validar_quantidade,
    validar_quantidade_saida,
    validar_id_pedidos,
    validar_id_produto,
    validar_quantidade_lista,
    validar_preco_medio,
    validar_produto,
    validar_tipo_produto,
    validar_p_medio2,
    validar_cliente,
    validar_qtd_atual,
    validar_locais,
    validar_niv_min,
    validar_cpf,
    validar_fornecedor,
    validar_data_saida
)

app = Flask(__name__)

# LISTAS

id_transportadora_lista = []
nome_transportadora = []
sensores = []
tipos = []
status = []
id_item = []
quantidade_item_entrada=[]
qtde_saida_lista=[]
id_pedido = []
id_produto = []
quantidade_lista = []
preco_medio = []
produtos = []                
tipo_produto = []
preco_medio2 = []
clientes = []
produto_detalhes = []
validar_produto_detalhes_list = []  
qtd_atual = []
locais = []
niv_min = []
fornecedor = []
data_saida_lista=[]
data_entrada_lista=[]




# 1. ID Transportadora

@app.route("/id_transportadora", methods=["POST"])
def criar_id_transportadora():
    dados = request.get_json()
    if validar_id_transportadora(dados):
        id_transportadora_lista.append(dados)
        return jsonify({"valido": True, "msg": "ID cadastrado com sucesso!"}), 201
    return jsonify({"valido": False, "msg": "ID inválido! Deve conter exatamente 6 números."}), 400

@app.route("/id_transportadora", methods=["GET"])
def listar_todos_ids():
    if len(id_transportadora_lista) == 0:
        return jsonify({"mensagem": "Nenhum ID cadastrado ainda."}), 200
    return jsonify(id_transportadora_lista), 200

@app.route("/id_transportadora/<int:indice>", methods=["GET"])
def buscar_id_transportadora(indice):
    if 0 <= indice < len(id_transportadora_lista):
        return jsonify(id_transportadora_lista[indice]), 200
    return jsonify({"erro": "ID não encontrado"}), 404

@app.route("/id_transportadora/<int:indice>", methods=["PUT"])
def atualizar_id_transportadora(indice):
    if 0 <= indice < len(id_transportadora_lista):
        dados = request.get_json()
        if validar_id_transportadora(dados):
            id_transportadora_lista[indice] = dados
            return jsonify({"mensagem": "ID atualizado com sucesso!"}), 200
        return jsonify({"erro": "ID inválido! Deve conter exatamente 6 números."}), 400
    return jsonify({"erro": "ID não encontrado"}), 404

@app.route("/id_transportadora/<int:indice>", methods=["DELETE"])
def deletar_id_transportadora(indice):
    if 0 <= indice < len(id_transportadora_lista):
        id_transportadora_lista[indice] = "removido"
        return jsonify({"mensagem": "ID removido com sucesso!"}), 200
    return jsonify({"erro": "ID não encontrado"}), 404





# 2. Nome Transportadora

@app.route("/nome_transportadora", methods=["POST"])
def criar_nome_transportadora():
    dados = request.get_json()
    if validar_nome_transportadora(dados):
        nome_transportadora.append(dados)
        return jsonify({"valido": True, "msg": "Nome cadastrado com sucesso!"}), 201
    return jsonify({"valido": False, "msg": "Nome inválido! Deve conter pelo menos 3 letras."}), 400

@app.route("/nome_transportadora", methods=["GET"])
def listar_todos_nomes():
    if len(nome_transportadora) == 0:
        return jsonify({"mensagem": "Nenhum nome cadastrado ainda."}), 200
    return jsonify(nome_transportadora), 200

@app.route("/nome_transportadora/<int:indice>", methods=["GET"])
def buscar_nome_transportadora(indice):
    if 0 <= indice < len(nome_transportadora):
        return jsonify(nome_transportadora[indice]), 200
    return jsonify({"erro": "Nome não encontrado"}), 404

@app.route("/nome_transportadora/<int:indice>", methods=["PUT"])
def atualizar_nome_transportadora(indice):
    if 0 <= indice < len(nome_transportadora):
        dados = request.get_json()
        if validar_nome_transportadora(dados):
            nome_transportadora[indice] = dados
            return jsonify({"mensagem": "Nome atualizado com sucesso!"}), 200
        return jsonify({"erro": "Nome inválido! Deve conter pelo menos 3 letras."}), 400
    return jsonify({"erro": "Nome não encontrado"}), 404

@app.route("/nome_transportadora/<int:indice>", methods=["DELETE"])
def deletar_nome_transportadora(indice):
    if 0 <= indice < len(nome_transportadora):
        nome_transportadora[indice] = "removido"
        return jsonify({"mensagem": "Nome removido com sucesso!"}), 200
    return jsonify({"erro": "Nome não encontrado"}), 404




# --- 6. sensores 
@app.route("/sensor", methods=["POST"])
def adicionar_sensor():
    dados = request.get_json()
    if validar_sensor(dados):
        sensores.append(dados)
        return jsonify({"mensagem": "Sensor adicionado com sucesso!"}), 201
    return jsonify({
        "erro": "Tipo de sensor inválido!",
        "permitidos": [
            "Termistor NTC", "Sensor de Presença PIR", "LDR", "Sensor Indutivo de Proximidade",
            "Sensor de Movimento PIR", "DHT11", "Sensor de Vazão tipo Turbina",
            "Pressostato", "Sensor de Gás MQ-x", "Célula de Carga"
        ]
    }), 400


@app.route("/sensor", methods=["GET"])
def listar_sensores():
    if len(sensores) == 0:
        return jsonify({"mensagem": "Nenhum sensor cadastrado ainda."}), 200
    return jsonify(sensores), 200


@app.route("/sensor/<int:indice>", methods=["GET"])
def buscar_sensor(indice):
    if 0 <= indice < len(sensores):
        return jsonify(sensores[indice]), 200
    return jsonify({"erro": "Sensor não encontrado"}), 404


@app.route("/sensor/<int:indice>", methods=["PUT"])
def atualizar_sensor(indice):
    if 0 <= indice < len(sensores):
        dados = request.get_json()
        if validar_sensor(dados):
            sensores[indice] = dados   
            return jsonify({"mensagem": "Sensor atualizado com sucesso!"}), 200
        return jsonify({"erro": "Tipo inválido! Use apenas sensores permitidos."}), 400
    return jsonify({"erro": "Sensor não encontrado"}), 404


@app.route("/sensores/<int:indice>", methods=["DELETE"])
def deletar_sensor(indice):
    if 0 <= indice < len(sensores):
        sensores[indice] = "removido"
        return jsonify({"mensagem": "Sensor removido com sucesso!"}), 200
    return jsonify({"erro": "Sensor não encontrado"}), 404




# --- 7. tipos de sensores

@app.route("/tipos", methods=["GET"])
def listar_tipos():
    if not tipos:
        return jsonify({"mensagem": "Nenhum tipo cadastrado ainda."}), 200
    return jsonify(tipos), 200


@app.route("/tipos", methods=["POST"])
def adicionar_tipo():
    novo_item = request.get_json()
    if validar_tipo_sensor(novo_item):
        tipos.append(novo_item)
        return jsonify({"mensagem": "Tipo adicionado com sucesso!"}), 201
    else:
        return jsonify({
            "erro": "Tipo de sensor inválido!",
            "permitidos": {
                1: "temperatura",
                2: "umidade",
                3: "presença",
                4: "luminosidade",
                5: "proximidade",
                6: "movimento",
                7: "vazão",
                8: "pressão",
                9: "gás",
                10: "peso"
            }
        }), 400


@app.route("/tipos/<int:indice>", methods=["GET"])
def buscar_tipo(indice):
    if 0 <= indice < len(tipos):
        return jsonify(tipos[indice]), 200
    return jsonify({"erro": "Tipo não encontrado"}), 404


@app.route("/tipos/<int:indice>", methods=["PUT"])
def atualizar_tipo(indice):
    if 0 <= indice < len(tipos):
        dados = request.get_json()
        if validar_tipo_sensor(dados):
            tipos[indice] = dados   
            return jsonify({"mensagem": "Tipo atualizado com sucesso!"}), 200
        else:
            return jsonify({"erro": "Tipo inválido! Use apenas sensores permitidos."}), 400
    return jsonify({"erro": "Tipo não encontrado"}), 404


@app.route("/tipos/<int:indice>", methods=["DELETE"])
def deletar_tipo(indice):
    if 0 <= indice < len(tipos):
        tipos[indice] = "removido"
        return jsonify({"mensagem": "Tipo removido com sucesso!"}), 200
    return jsonify({"erro": "Tipo não encontrado"}), 404



# ---- descrição

@app.route("/status", methods=["GET"])
def listar_status():
    if len(status) == 0:
        return jsonify({"mensagem": "Nenhuma descrição cadastrada ainda."}), 200
    return jsonify(status), 200


@app.route("/status", methods=["POST"])
def adicionar_status():
    novo_item = request.get_json()
    if validar_descricao(novo_item):
        status.append(novo_item)
        return jsonify({"mensagem": "Descrição adicionada com sucesso!"}), 201
    else:
        return jsonify({
            "erro": "Descrição inválida! Use apenas as permitidas abaixo.",
            "permitidas": [
                "operacional",
                "em manutenção",
                "falha detectada",
                "desconectado",
                "em teste",
                "pendente de configuração",
                "alerta emitido",
                "uso contínuo",
                "desligado manualmente"
            ]
        }), 400


@app.route("/status/<int:indice>", methods=["GET"])
def buscar_status(indice):
    if 0 <= indice < len(status):
        return jsonify(status[indice]), 200
    return jsonify({"erro": "Descrição não encontrada"}), 404


@app.route("/status/<int:indice>", methods=["PUT"])
def atualizar_status(indice):
    if 0 <= indice < len(status):
        dados = request.get_json()
        if validar_descricao(dados):
            status[indice] = dados
            return jsonify({"mensagem": "Descrição atualizada com sucesso!"}), 200
        else:
            return jsonify({"erro": "Descrição inválida! Use apenas as permitidas."}), 400
    return jsonify({"erro": "Descrição não encontrada"}), 404


@app.route("/status/<int:indice>", methods=["DELETE"])
def deletar_status(indice):
    if 0 <= indice < len(status):
        status[indice] = "removido"
        return jsonify({"mensagem": "Descrição removida com sucesso!"}), 200
    return jsonify({"erro": "Descrição não encontrada"}), 404



# --- 10. id_item_lista 


@app.route("/id_item", methods=["POST"])
def adicionar_id_item():
    dados = request.get_json()
    resultado = validar_id_item(dados)
    if resultado:
        id_item.append(dados)
        return jsonify({"valido": True, "msg": "ID Item cadastrado com sucesso"}), 201
    else:
        return jsonify({"valido": False, "msg": "ID item inválido"}), 400


@app.route("/id_item", methods=["GET"])
def buscar_todos_id_item():
    if len(id_item) == 0:
        return jsonify({"mensagem": "Nenhum ID de item cadastrado ainda"}), 200
    return jsonify(id_item), 200


@app.route("/id_item/<int:indice>", methods=["GET"])
def buscar_id_item(indice):
    if 0 <= indice < len(id_item):
        return jsonify(id_item[indice]), 200
    return jsonify({"erro": "ID de item não encontrado"}), 404


@app.route("/id_item/<int:indice>", methods=["PUT"])
def atualizar_id_item(indice):
    if 0 <= indice < len(id_item):
        dados = request.get_json()
        id_item[indice] = dados   
        return jsonify({"mensagem": "ID de item atualizado com sucesso!"}), 200
    return jsonify({"erro": "ID de item não encontrado"}), 404


@app.route("/id_item/<int:indice>", methods=["DELETE"])
def deletar_id_item(indice):
    if 0 <= indice < len(id_item):
        id_item[indice] = "removido"
        return jsonify({"mensagem": "ID removido com sucesso!"}), 200
    return jsonify({"erro": "ID não encontrado"}), 404




#--- quatidade item entrada 

@app.route("/qtde-entrada", methods=["GET"])
def listar_qtde_entrada():
    if len(quantidade_item_entrada) == 0:
        return jsonify({"mensagem": "Nenhuma quantidade registrada."}), 200
    return jsonify(quantidade_item_entrada), 200


@app.route("/qtde-entrada", methods=["POST"])
def adicionar_qtde_entrada():
    novo_item = request.get_json()
    if validar_quantidade(novo_item):
        quantidade_item_entrada.append(novo_item)
        return jsonify({"mensagem": "Quantidade de entrada registrada!"}), 201
    return jsonify({"erro": "Quantidade inválida! Envie um número inteiro positivo."}), 400


@app.route("/qtde-entrada/<int:indice>", methods=["GET"])
def buscar_qtde_entrada(indice):
    if 0 <= indice < len(quantidade_item_entrada):
        return jsonify(quantidade_item_entrada[indice]), 200
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/qtde-entrada/<int:indice>", methods=["PUT"])
def atualizar_qtde_entrada(indice):
    if 0 <= indice < len(quantidade_item_entrada):
        dados = request.get_json()
        if validar_quantidade(dados):
            quantidade_item_entrada[indice] = dados
            return jsonify({"mensagem": "Quantidade atualizada!"}), 200
        return jsonify({"erro": "Quantidade inválida!"}), 400
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/qtde-entrada/<int:indice>", methods=["DELETE"])
def deletar_qtde_entrada(indice):
    if 0 <= indice < len(quantidade_item_entrada):
        quantidade_item_entrada[indice] = "removido"
        return jsonify({"mensagem": "Quantidade removida!"}), 200
    return jsonify({"erro": "Registro não encontrado"}), 404




# --- quantidade saida 

# --- quantidade item saída

@app.route("/qtde-saida", methods=["GET"])
def listar_qtde_saida():
    if len(qtde_saida_lista) == 0:
        return jsonify({"mensagem": "Nenhuma quantidade de saída registrada."}), 200
    return jsonify(qtde_saida_lista), 200


@app.route("/qtde-saida", methods=["POST"])
def adicionar_qtde_saida():
    novo_item = request.get_json()
    if validar_quantidade_saida(novo_item):
        qtde_saida_lista.append(novo_item)
        return jsonify({"mensagem": "Quantidade de saída registrada!"}), 201
    return jsonify({"erro": "Quantidade inválida! Envie um número inteiro positivo."}), 400


@app.route("/qtde-saida/<int:indice>", methods=["GET"])
def buscar_qtde_saida(indice):
    if 0 <= indice < len(qtde_saida_lista):
        return jsonify(qtde_saida_lista[indice]), 200
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/qtde-saida/<int:indice>", methods=["PUT"])
def atualizar_qtde_saida(indice):
    if 0 <= indice < len(qtde_saida_lista):
        dados = request.get_json()
        if validar_quantidade_saida(dados):
            qtde_saida_lista[indice] = dados
            return jsonify({"mensagem": "Quantidade de saída atualizada!"}), 200
        return jsonify({"erro": "Quantidade inválida!"}), 400
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/qtde-saida/<int:indice>", methods=["DELETE"])
def deletar_qtde_saida(indice):
    if 0 <= indice < len(qtde_saida_lista):
        qtde_saida_lista[indice] = "removido"
        return jsonify({"mensagem": "Quantidade removida!"}), 200
    return jsonify({"erro": "Registro não encontrado"}), 404




# --- 11. id_pedido_lista 


@app.route("/id_pedido", methods=["POST"])
def adicionar_id_pedido():
    dados = request.get_json()
    resultado = validar_id_pedidos(dados)
    if resultado:
        id_pedido.append(dados)
        return jsonify({"valido": True, "msg": "ID de pedido cadastrado com sucesso!"}), 201
    else:
        return jsonify({"valido": False, "msg": "ID de pedido inválido"}), 400


@app.route("/id_pedido", methods=["GET"])
def buscar_todos_id_pedido():
    if len(id_pedido) == 0:
        return jsonify({"mensagem": "Nenhum ID de pedido cadastrado ainda"}), 200
    return jsonify(id_pedido), 200


@app.route("/id_pedido/<int:indice>", methods=["GET"])
def buscar_id_pedido(indice):
    if 0 <= indice < len(id_pedido):
        return jsonify(id_pedido[indice]), 200
    return jsonify({"erro": "ID de pedido não encontrado"}), 404


@app.route("/id_pedido/<int:indice>", methods=["PUT"])
def atualizar_id_pedido(indice):
    if 0 <= indice < len(id_pedido):
        dados = request.get_json()
        id_pedido[indice] = dados   
        return jsonify({"mensagem": "ID de pedido atualizado com sucesso!"}), 200
    return jsonify({"erro": "ID de pedido não encontrado"}), 404


@app.route("/id_pedido/<int:indice>", methods=(["DELETE"]))
def deletar_id_pedido(indice):
    if 0 <= indice < len(id_pedido):
        id_pedido[indice] = "removido"
        return jsonify({"mensagem": "ID removido com sucesso!"}), 200
    return jsonify({"erro": "ID não encontrado"}), 404







# --- 12. Id_produto ---

@app.route("/id_produto", methods=["POST"])
def adicionar_id_produto():
    dados = request.get_json()
    resultado = validar_id_produto(dados)
    if resultado:
        id_produto.append(dados)
        return jsonify({"valido": True, "msg": "ID de produto cadastrado com sucesso!"}), 201
    else:
        return jsonify({"valido": False, "msg": "ID de produto inválido. Deve conter 6 dígitos numéricos."}), 400


@app.route("/id_produto", methods=["GET"])
def buscar_todos_id_produto():
    if len(id_produto) == 0:
        return jsonify({"mensagem": "Nenhum ID de produto cadastrado ainda"}), 200
    return jsonify(id_produto), 200


@app.route("/id_produto/<int:indice>", methods=["GET"])
def buscar_id_produto(indice):
    if 0 <= indice < len(id_produto):
        return jsonify(id_produto[indice]), 200
    return jsonify({"erro": "ID de produto não encontrado"}), 404


@app.route("/id_produto/<int:indice>", methods=["PUT"])
def atualizar_id_produto(indice):
    if 0 <= indice < len(id_produto):
        dados = request.get_json()
        id_produto[indice] = dados   
        return jsonify({"mensagem": "ID de produto atualizado com sucesso!"}), 200
    return jsonify({"erro": "ID de produto não encontrado"}), 404


@app.route("/id_produto/<int:indice>", methods=["DELETE"])
def deletar_id_produto(indice):
    if 0 <= indice < len(id_produto):
        id_produto[indice] = "removido"
        return jsonify({"mensagem": "ID removido com sucesso!"}), 200
    return jsonify({"erro": "ID não encontrado"}), 404






# --- 13. quantidade_lista 


@app.route("/quantidade_lista", methods=["POST"])
def adicionar_quantidade_lista():
    dados = request.get_json()
    resultado = validar_quantidade_lista(dados)
    if resultado:
        quantidade_lista.append(dados)
        return jsonify({"valido": True, "msg": "Quantidade de listas cadastrada com sucesso!"}), 201
    else:
        return jsonify({"valido": False, "msg": "Deve conter apenas números."}), 400


@app.route("/quantidade_lista", methods=["GET"])
def listar_quantidade_lista():
    if len(quantidade_lista) == 0:
        return jsonify({"mensagem": "Nenhuma Lista foi cadastrada"}), 200
    return jsonify(quantidade_lista), 200


@app.route("/quantidade_lista/<int:indice>", methods=["GET"])
def buscar_quantidade_lista(indice):
    if 0 <= indice < len(quantidade_lista):
        return jsonify(quantidade_lista[indice]), 200
    return jsonify({"erro": "Lista não encontrada"}), 404


@app.route("/quantidade_lista/<int:indice>", methods=["PUT"])
def atualizar_quantidade_lista(indice):
    if 0 <= indice < len(quantidade_lista):
        dados = request.get_json()
        quantidade_lista[indice] = dados   
        return jsonify({"mensagem": "Quantidade atualizada com sucesso!"}), 200
    return jsonify({"erro": "Quantidade não encontrada"}), 404


@app.route("/quantidade_lista/<int:indice>", methods=["DELETE"])
def deletar_quantidade(indice):
    if 0 <= indice < len(quantidade_lista):
        quantidade_lista[indice] = "removido"
        return jsonify({"mensagem": "Quantidade removida com sucesso!"}), 200
    return jsonify({"erro": "Quantidade não encontrada"}), 404








# --- 14. preco_medio 


@app.route("/preco_medio", methods=["POST"])
def criar_preco_medio():
    dados = request.get_json()
    if validar_preco_medio(dados):
        preco_medio.append(dados)
        return jsonify({
            "valido": True,
            "msg": "Preço médio cadastrado com sucesso!",
            "preco_medio_informado": dados.get("preco_medio")
        }), 201
    return jsonify({
        "valido": False,
        "msg": "Preço inválido! Envie um número (Ex: 12.50)"
    }), 400

@app.route("/preco_medio", methods=["GET"])
def listar_precos():
    if len(preco_medio) == 0:
        return jsonify({"mensagem": "nenhum Preço foi cadastrado"}), 200
    return jsonify(preco_medio), 200

@app.route("/preco_medio/<int:indice>", methods=["GET"])
def buscar_preco(indice):
    if 0 <= indice < len(preco_medio):
        return jsonify(preco_medio[indice]), 200
    return jsonify({"erro": "Índice não encontrado"}), 404

@app.route("/preco_medio/<int:indice>", methods=["PUT"])
def atualizar_preco(indice):
    if 0 <= indice < len(preco_medio):
        dados = request.get_json()
        if validar_preco_medio(dados):
            preco_medio[indice] = dados
            return jsonify({"mensagem": "Preço atualizado com sucesso!"}), 200
        return jsonify({"erro": "Preço inválido!"}), 400
    return jsonify({"erro": "Índice não encontrado"}), 404

@app.route("/preco_medio/<int:indice>", methods=["DELETE"])
def deletar_preco_medio(indice):
    if 0 <= indice < len(preco_medio):
        preco_medio[indice] = "removido"
        return jsonify({"mensagem": "Preço removido com sucesso!"}), 200
    return jsonify({"erro": "Item não encontrado"}), 404






# --- 15. produtos 



@app.route("/produtos", methods=["GET"])
def listar_produtos():
    if len(produtos) == 0:
        return jsonify({"mensagem": "Nenhum Produto foi cadastrado"}), 200
    return jsonify(produtos), 200


@app.route("/produtos", methods=["POST"])
def adicionar_produto():
    novo_item = request.get_json()
    produtos.append(novo_item)
    return jsonify({"mensagem": "Produto adicionado com sucesso!"}), 201


@app.route("/produtos/<int:indice>", methods=["GET"])
def buscar_produto(indice):
    if 0 <= indice < len(produtos):
        return jsonify(produtos[indice]), 200
    return jsonify({"erro": "Produto não encontrado"}), 404


@app.route("/produtos/<int:indice>", methods=["PUT"])
def atualizar_produto(indice):
    if 0 <= indice < len(produtos):
        dados = request.get_json()
        produtos[indice] = dados  
        return jsonify({"mensagem": "Produto atualizado com sucesso!"}), 200
    return jsonify({"erro": "Produto não encontrado"}), 404


@app.route("/produtos/<int:indice>", methods=["DELETE"])
def deletar_produto(indice):
    if 0 <= indice < len(produtos):
        produtos[indice] = "removido"
        return jsonify({"mensagem": "Produto removido com sucesso!"}), 200
    return jsonify({"erro": "Produto não encontrado"}), 404






# --- 16. tipo_produto 


@app.route("/tipo_produto", methods=["GET"])
def listar_tipo_produto():
    if len(tipo_produto) == 0:
        return jsonify({"mensagem": "Nenhum Tipo de Produto foi cadastrado"}), 200
    return jsonify(tipo_produto), 200


@app.route("/tipo_produto", methods=["POST"])
def adicionar_tipo_produto():
    novo_item = request.get_json()
    tipo_produto.append(novo_item)
    return jsonify({"mensagem": "Tipo de Produto adicionado com sucesso!"}), 201


@app.route("/tipo_produto/<int:indice>", methods=["GET"])
def buscar_tipo_produto(indice):
    if 0 <= indice < len(tipo_produto):
        return jsonify(tipo_produto[indice]), 200
    return jsonify({"erro": "Tipo de Produto não encontrado"}), 404


@app.route("/tipo_produto/<int:indice>", methods=["PUT"])
def atualizar_tipo_produto(indice):
    if 0 <= indice < len(tipo_produto):
        dados = request.get_json()
        tipo_produto[indice] = dados   
        return jsonify({"mensagem": "Tipo de Produto atualizado com sucesso!"}), 200
    return jsonify({"erro": "Tipo de Produto não encontrado"}), 404


@app.route("/tipo_produto/<int:indice>", methods=["DELETE"])
def deletar_tipo_produto(indice):
    if 0 <= indice < len(tipo_produto):
        tipo_produto[indice] = "removido"
        return jsonify({"mensagem": "Tipo removido com sucesso!"}), 200
    return jsonify({"erro": "Tipo não encontrado"}), 404






# --- 17. preco_medio2 


@app.route("/preco_medio2", methods=["GET"])
def listar_precos2():
    if len(preco_medio2) == 0:
        return jsonify({"mensagem": "Nenhum preço médio 2 foi cadastrado"}), 200
    return jsonify(preco_medio2), 200

@app.route("/preco_medio2/<int:indice>", methods=["GET"])
def buscar_preco2(indice):
    if 0 <= indice < len(preco_medio2):
        return jsonify(preco_medio2[indice]), 200
    return jsonify({"erro": "Índice não encontrado"}), 404

@app.route("/preco_medio2", methods=["POST"])
def criar_preco_medio2():
    dados = request.get_json()
    if validar_p_medio2(dados):
        preco_medio2.append(dados)
        return jsonify({
            "valido": True,
            "msg": "Preço médio 2 cadastrado com sucesso!",
            "preco_medio_informado": dados.get("preco_medio2")
        }), 201
    return jsonify({
        "valido": False,
        "msg": "Preço inválido! Envie um número positivo (Ex: 12.50)"
    }), 400

@app.route("/preco_medio2/<int:indice>", methods=["PUT"])
def atualizar_preco2(indice):
    if 0 <= indice < len(preco_medio2):
        dados = request.get_json()
        if validar_p_medio2(dados):
            preco_medio2[indice] = dados
            return jsonify({"mensagem": "Preço médio 2 atualizado com sucesso!"}), 200
        return jsonify({"erro": "Preço inválido! Envie um número positivo (Ex: 12.50)"}), 400
    return jsonify({"erro": "Índice não encontrado"}), 404

@app.route("/preco_medio2/<int:indice>", methods=["DELETE"])
def deletar_preco_medio2(indice):
    if 0 <= indice < len(preco_medio2):
        preco_medio2[indice] = "removido"
        return jsonify({"mensagem": "Preço removido com sucesso!"}), 200
    return jsonify({"erro": "Item não encontrado"}), 404







# --- 18. clientes 


@app.route("/clientes_base", methods=["GET"])
def listar_clientes():
    if len(clientes) == 0:
        return jsonify({"mensagem": "Nenhum cliente cadastrado"}), 200
    return jsonify(clientes), 200


@app.route("/clientes_base/<int:indice>", methods=["GET"])
def buscar_cliente_base(indice):
    if 0 <= indice < len(clientes):
        return jsonify(clientes[indice]), 200
    return jsonify({"erro": "Cliente base não encontrado"}), 404


@app.route("/clientes_base", methods=["POST"])
def adicionar_cliente_base():
    novo_item = request.get_json()
    if validar_cliente(novo_item):   
        clientes.append(novo_item)
        return jsonify({"mensagem": "Cliente base adicionado com sucesso!"}), 201
    return jsonify({"erro": "Cliente inválido! Deve ter pelo menos 3 letras."}), 400


@app.route("/clientes_base/<int:indice>", methods=["PUT"])
def atualizar_cliente_base(indice):
    if 0 <= indice < len(clientes):
        dados = request.get_json()
        if validar_cliente(dados):
            clientes[indice].update(dados)
            return jsonify({"mensagem": "Cliente base atualizado com sucesso!"}), 200
        return jsonify({"erro": "Cliente inválido! Deve ter pelo menos 3 letras."}), 400
    return jsonify({"erro": "Cliente base não encontrado"}), 404


@app.route("/clientes/<int:indice>", methods=["DELETE"])
def deletar_cliente(indice):
    if 0 <= indice < len(clientes):
        clientes[indice] = "removido"
        return jsonify({"mensagem": "Cliente removido com sucesso!"}), 200
    return jsonify({"erro": "Cliente não encontrado"}), 404




























# --- 22. produto_detalhes 


@app.route("/produto_detalhes", methods=["GET"])
def listar_produto_detalhes():
    if len(produto_detalhes) == 0:
        return jsonify({"mensagem": "Nenhum detalhe de produto cadastrado"}), 200
    return jsonify(produto_detalhes), 200


@app.route("/produto_detalhes", methods=["POST"])
def adicionar_produto_detalhes():
    novo_item = request.get_json()
    produto_detalhes.append(novo_item)
    return jsonify({"mensagem": "Produto detalhado com sucesso!"}), 201


@app.route("/produto_detalhes/<int:indice>", methods=["GET"])
def buscar_produto_detalhes(indice):
    if 0 <= indice < len(produto_detalhes):
        return jsonify(produto_detalhes[indice]), 200
    return jsonify({"erro": "Detalhe do produto não encontrado"}), 404


@app.route("/produto_detalhes/<int:indice>", methods=["PUT"])
def atualizar_produto_detalhes(indice):
    if 0 <= indice < len(produto_detalhes):
        dados = request.get_json()
        produto_detalhes[indice] = dados   
        return jsonify({"mensagem": "Detalhe do produto atualizado com sucesso!"}), 200
    return jsonify({"erro": "Detalhe do produto não encontrado"}), 404


@app.route("/produto_detalhes/<int:indice>", methods=["DELETE"])
def deletar_produto_detalhes(indice):
    if 0 <= indice < len(produto_detalhes):
        produto_detalhes[indice] = "removido"
        return jsonify({"mensagem": "Detalhe removido com sucesso!"}), 200
    return jsonify({"erro": "Detalhe não encontrado"}), 404






# --- 23. Quantidade atual 

@app.route("/qtd_atual", methods=["GET"])
def listar_qtd_atual():
    if len(qtd_atual) == 0:
        return jsonify({"mensagem": "Nenhuma quantidade registrada ainda."}), 200
    return jsonify(qtd_atual), 200


@app.route("/qtd_atual", methods=["POST"])
def adicionar_qtd_atual():
    novo_item = request.get_json()
    qtd_atual.append(novo_item)
    return jsonify({"mensagem": "Quantidade registrada com sucesso!"}), 201


@app.route("/qtd_atual/<int:indice>", methods=["GET"])
def buscar_qtd_atual(indice):
    if 0 <= indice < len(qtd_atual):
        return jsonify(qtd_atual[indice]), 200
    return jsonify({"erro": "Quantidade não encontrada"}), 404


@app.route("/qtd_atual/<int:indice>", methods=["PUT"])
def atualizar_qtd_atual(indice):
    if 0 <= indice < len(qtd_atual):
        dados = request.get_json()
        qtd_atual[indice] = dados
        return jsonify({"mensagem": "Quantidade atualizada com sucesso!"}), 200
    return jsonify({"erro": "Quantidade não encontrada"}), 404


@app.route("/qtd_atual/<int:indice>", methods=["DELETE"])
def deletar_qtd_atual(indice):
    if 0 <= indice < len(qtd_atual):
        qtd_atual[indice] = "removido"
        return jsonify({"mensagem": "Quantidade removida com sucesso!"}), 200
    return jsonify({"erro": "Quantidade não encontrada"}), 404







# --- 24. Locais 

@app.route("/locais", methods=["GET"])
def listar_locais():
    if len(locais) == 0:
        return jsonify({"mensagem": "Nenhum local registrado ainda."}), 200
    return jsonify(locais), 200


@app.route("/locais", methods=["POST"])
def adicionar_local():
    novo_item = request.get_json()
    locais.append(novo_item)
    return jsonify({"mensagem": "Local registrado com sucesso!"}), 201


@app.route("/locais/<int:indice>", methods=["GET"])
def buscar_local(indice):
    if 0 <= indice < len(locais):
        return jsonify(locais[indice]), 200
    return jsonify({"erro": "Local não encontrado"}), 404


@app.route("/locais/<int:indice>", methods=["PUT"])
def atualizar_local(indice):
    if 0 <= indice < len(locais):
        dados = request.get_json()
        locais[indice] = dados
        return jsonify({"mensagem": "Local atualizado com sucesso!"}), 200
    return jsonify({"erro": "Local não encontrado"}), 404


@app.route("/locais/<int:indice>", methods=["DELETE"])
def deletar_local(indice):
    if 0 <= indice < len(locais):
        locais[indice] = "removido"
        return jsonify({"mensagem": "Local removido com sucesso!"}), 200
    return jsonify({"erro": "Local não encontrado"}), 404



# --- 25. Nivél minimo 

@app.route("/niv_min", methods=["GET"])
def listar_niv_min():
    if len(niv_min) == 0:
        return jsonify({"mensagem": "Nenhum nível mínimo registrado ainda."}), 200
    return jsonify(niv_min), 200


@app.route("/niv_min", methods=["POST"])
def adicionar_niv_min():
    novo_item = request.get_json()
    niv_min.append(novo_item)
    return jsonify({"mensagem": "Nível mínimo registrado com sucesso!"}), 201


@app.route("/niv_min/<int:indice>", methods=["GET"])
def buscar_niv_min(indice):
    if 0 <= indice < len(niv_min):
        return jsonify(niv_min[indice]), 200
    return jsonify({"erro": "Nível mínimo não encontrado"}), 404


@app.route("/niv_min/<int:indice>", methods=["PUT"])
def atualizar_niv_min(indice):
    if 0 <= indice < len(niv_min):
        dados = request.get_json()
        niv_min[indice] = dados
        return jsonify({"mensagem": "Nível mínimo atualizado com sucesso!"}), 200
    return jsonify({"erro": "Nível mínimo não encontrado"}), 404


@app.route("/niv_min/<int:indice>", methods=["DELETE"])
def deletar_niv_min(indice):
    if 0 <= indice < len(niv_min):
        niv_min[indice] = "removido"
        return jsonify({"mensagem": "Nível removido com sucesso!"}), 200
    return jsonify({"erro": "Nível não encontrado"}), 404




# --- 26. Validar fornecedor


@app.route("/fornecedor", methods=["GET"])
def listar_fornecedor():
    if len(fornecedor) == 0:
        return jsonify({"mensagem": "Nenhum Fornecedor foi cadastrado"}), 200
    return jsonify(fornecedor), 200


@app.route("/fornecedor", methods=["POST"])
def adicionar_fornecedor():
    novo_fornecedor = request.get_json()
    fornecedor.append(novo_fornecedor)
    return jsonify({"mensagem": "Fornecedor adicionado com sucesso!"}), 201


@app.route("/fornecedor/<int:indice>", methods=["GET"])
def buscar_fornecedor(indice):
    if 0 <= indice < len(fornecedor):
        return jsonify(fornecedor[indice]), 200
    return jsonify({"erro": "Fornecedor não encontrado!"}), 404


@app.route("/fornecedor/<int:indice>", methods=["PUT"])
def atualizar_fornecedor(indice):
    if 0 <= indice < len(fornecedor):
        dados = request.get_json()
        fornecedor[indice] = dados  
        return jsonify({"mensagem": "Fornecedor atualizado com sucesso!"}), 200
    return jsonify({"erro": "Fornecedor  não encontrado!"}), 404


@app.route("/fornecedor/<int:indice>", methods=["DELETE"])
def deletar_fornecedor(indice):
    if 0 <= indice < len(fornecedor):
        fornecedor[indice] = "removido"
        return jsonify({"mensagem": "Fornecedor removido com sucesso!"}), 200
    return jsonify({"erro": "Fornecedor não encontrado!!"}), 404


# --- 27. VALIDAR TOKEN CPF 

token = "22452|eGBmfQgXtcuCVLtX0pH4Kuuy5EqVinzS"

def validar_cpf_via_api(cpf):
    url = f"https://api.invertexto.com/v1/validator?token={token}&value={cpf}&type=cpf"
    
    try:
        resposta = requests.get(url)
        return resposta.json()
    except:
        return {"erro": "Falha ao validar CPF"}

@app.route("/validar_cpf", methods=["GET"])
def rota_validar_cpf():
    cpf = request.args.get("cpf")

    if not cpf:
        return jsonify({"erro": "CPF não enviado"}), 400

    resultado = validar_cpf_via_api(cpf)
    return jsonify(resultado), 200


# --- 28. VLIDAR CNPJ-TOKEN

token = "22452|eGBmfQgXtcuCVLtX0pH4Kuuy5EqVinzS"

def validar_cnpj_via_api(cnpj):
    url = f"https://api.invertexto.com/v1/validator?token={token}&value={cnpj}&type=cnpj"
    
    try:
        resposta = requests.get(url)
        return resposta.json()
    except:
        return {"erro": "Falha ao validar CNPJ"}

@app.route("/validar_cnpj", methods=["GET"])
def rota_validar_cnpj():
    cnpj = request.args.get("cnpj")

    if not cnpj:
        return jsonify({"erro": "CNPJ não enviado"}), 400

    resultado = validar_cnpj_via_api(cnpj)
    return jsonify(resultado), 200





# --- data de saída

@app.route("/data-saida", methods=["GET"])
def listar_data_saida():
    if len(data_saida_lista) == 0:
        return jsonify({"mensagem": "Nenhuma data registrada."}), 200
    return jsonify(data_saida_lista), 200


@app.route("/data-saida", methods=["POST"])
def adicionar_data_saida():
    novo_item = request.get_json()
    if validar_data_saida(novo_item):
        data_saida_lista.append(novo_item)
        return jsonify({"mensagem": "Data de saída registrada!"}), 201
    return jsonify({"erro": "Data inválida! Use o formato YYYY-MM-DD."}), 400


@app.route("/data-saida/<int:indice>", methods=["GET"])
def buscar_data_saida(indice):
    if 0 <= indice < len(data_saida_lista):
        return jsonify(data_saida_lista[indice]), 200
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/data-saida/<int:indice>", methods=["PUT"])
def atualizar_data_saida(indice):
    if 0 <= indice < len(data_saida_lista):
        dados = request.get_json()
        if validar_data_saida(dados):
            data_saida_lista[indice] = dados
            return jsonify({"mensagem": "Data de saída atualizada!"}), 200
        return jsonify({"erro": "Data inválida! Use o formato YYYY-MM-DD."}), 400
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/data-saida/<int:indice>", methods=["DELETE"])
def deletar_data_saida(indice):
    if 0 <= indice < len(data_saida_lista):
        data_saida_lista[indice] = "removido"
        return jsonify({"mensagem": "Data removida!"}), 200
    return jsonify({"erro": "Registro não encontrado"}), 404



#--- data entrada

@app.route("/data-entrada", methods=["GET"])
def listar_data_entrada():
    if len(data_entrada_lista) == 0:
        return jsonify({"mensagem": "Nenhuma data registrada."}), 200
    return jsonify(data_entrada_lista), 200


@app.route("/data-entrada", methods=["POST"])
def adicionar_data_entrada():
    novo = request.get_json()
    if data_entrada_lista(novo):
        data_entrada_lista.append(novo)
        return jsonify({"mensagem": "Data de entrada registrada!"}), 201
    return jsonify({"erro": "Data inválida! Use YYYY-MM-DD."}), 400


@app.route("/data-entrada/<int:indice>", methods=["GET"])
def buscar_data_entrada(indice):
    if 0 <= indice < len(data_entrada_lista):
        return jsonify(data_entrada_lista[indice]), 200
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/data-entrada/<int:indice>", methods=["PUT"])
def atualizar_data_entrada(indice):
    if 0 <= indice < len(data_entrada_lista):
        dados = request.get_json()
        if data_entrada_lista(dados):
            data_entrada_lista[indice] = dados
            return jsonify({"mensagem": "Data de entrada atualizada!"}), 200
        return jsonify({"erro": "Data inválida! Use YYYY-MM-DD."}), 400
    return jsonify({"erro": "Registro não encontrado"}), 404


@app.route("/data-entrada/<int:indice>", methods=["DELETE"])
def deletar_data_entrada(indice):
    if 0 <= indice < len(data_entrada_lista):
        data_entrada_lista[indice] = "removido"
        return jsonify({"mensagem": "Data removida!"}), 200
    return jsonify({"erro": "Registro não encontrado"}), 404


if __name__ == "__main__":
    app.run(debug=True)