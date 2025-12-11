import mysql.connector
from conectar import connect_db

# ===================== FUNCIONÁRIO =====================

def insert_funcionario(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO funcionario (id_funcionario, nome, cargo, turno)
        VALUES (%s, %s, %s, %s)
        """
        values = (dados["id_funcionario"], dados["nome"], dados["cargo"], dados["turno"])
        cursor.execute(sql, values)
        conn.commit()
        return {'status': 'sucesso', 'mensagem': 'Funcionário criado com sucesso.'}

    except mysql.connector.Error as err:
        return {'status': 'erro', 'mensagem': f"Erro ao criar funcionário: {err}"}

    finally:
        cursor.close()
        conn.close()


# ===================== CLIENTE =====================

def insert_cliente(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = "INSERT INTO cliente (id_cliente, nome, cpf) VALUES (%s, %s, %s)"
        values = (dados["id_cliente"], dados["nome"], dados["cpf"])
        cursor.execute(sql, values)
        conn.commit()
        return {'status': 'sucesso', 'mensagem': 'Cliente criado com sucesso.'}

    except mysql.connector.Error as err:
        return {'status': 'erro', 'mensagem': f"Erro ao criar cliente: {err}"}

    finally:
        cursor.close()
        conn.close()


# ===================== FORNECEDOR =====================

def insert_fornecedor(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = "INSERT INTO fornecedor (nome, cnpj) VALUES (%s, %s)"
        values = (dados["nome"], dados["cnpj"])
        cursor.execute(sql, values)
        conn.commit()
        return {'status': 'sucesso', 'mensagem': 'Fornecedor criado com sucesso.'}

    except mysql.connector.Error as err:
        return {'status': 'erro', 'mensagem': f"Erro ao criar fornecedor: {err}"}

    finally:
        cursor.close()
        conn.close()


# ===================== ITEM DE ENTRADA =====================

def insert_itemEntrada(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()

        # Valida FK produto
        cursor.execute("SELECT COUNT(*) FROM produto WHERE id_produto = %s",
                       (dados["produto_id_produto"],))
        if cursor.fetchone()[0] == 0:
            return {"status": "erro", "mensagem": "Produto não existe (FK inválida)"}

        sql = """
        INSERT INTO itementrada (data_entrada, qtd, produto_id_produto)
        VALUES (%s, %s, %s)
        """
        valores = (dados["data_entrada"], dados["qtd"], dados["produto_id_produto"])
        cursor.execute(sql, valores)
        conn.commit()

        return {"status": "sucesso", "mensagem": "Item Entrada criado com sucesso"}

    except mysql.connector.Error as err:
        return {"status": "erro", "mensagem": str(err)}

    finally:
        cursor.close()
        conn.close()


# ===================== ITEM DE SAÍDA =====================

def inserir_itemsaida(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO itemsaida (data_itemsaida, qtd, produto_id_produto, pedido_saida_id_pedido_saida)
        VALUES (%s, %s, %s, %s)
        """
        valores = (
            dados['data_itemsaida'],
            dados['qtd'],
            dados['produto_id_produto'],
            dados['pedido_saida_id_pedido_saida']
        )
        cursor.execute(sql, valores)
        conn.commit()
        return {"mensagem": "Item de saída criado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== LOCALIZAÇÃO =====================

def inserir_localizacao(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO localizacao (rua, prateleira, nivel, numeracao)
        VALUES (%s, %s, %s, %s)
        """
        valores = (
            dados['rua'],
            dados['prateleira'],
            dados['nivel'],
            dados['numeracao']
        )
        cursor.execute(sql, valores)
        conn.commit()
        return {"mensagem": "Localização cadastrada com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== PEDIDO DE ENTRADA =====================

def inserir_pedido_entrada(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO pedido_entrada (
            data,
            status,
            fornecedor_id_fornecedor,
            transportadora_id_transportadora,
            funcionario_id_funcionario,
            itemEntrada_id_itemEntrada
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        valores = (
            dados['data'],
            dados['status'],
            dados['fornecedor_id_fornecedor'],
            dados['transportadora_id_transportadora'],
            dados['funcionario_id_funcionario'],
            dados['itemEntrada_id_itemEntrada']
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Pedido de entrada criado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== PEDIDO DE SAÍDA =====================

def inserir_pedido_saida(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO pedido_saida (
            data,
            status,
            transportadora_id_transportadora,
            funcionario_id_funcionario,
            cliente_id_cliente
        )
        VALUES (%s, %s, %s, %s, %s)
        """

        valores = (
            dados['data'],
            dados['status'],
            dados['transportadora_id_transportadora'],
            dados['funcionario_id_funcionario'],
            dados['cliente_id_cliente']
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Pedido de saída criado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== PRODUTO =====================

def inserir_produto(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()

        sql = """
        INSERT INTO produto (
            nome_produto,
            categoria,
            preco,
            localizacao_id_localizacao
        )
        VALUES (%s, %s, %s, %s)
        """

        valores = (
            dados['nome_produto'],
            dados['categoria'],
            dados['preco'],
            dados['localizacao_id_localizacao']
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Produto criado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== SENSOR =====================

def inserir_sensor(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO sensor (tipo, descricao, localizacao_id_localizacao)
        VALUES (%s, %s, %s)
        """

        valores = (
            dados['tipo'],
            dados['descricao'],
            dados['localizacao_id_localizacao']
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Sensor criado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== TRANSPORTADORA =====================

def inserir_transportadora(dados):
    conn = connect_db()
    try:
        cursor = conn.cursor()

        sql = """
        INSERT INTO transportadora (nome, cnpj)
        VALUES (%s, %s)
        """

        valores = (dados['nome'], dados['cnpj'])

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Transportadora criada com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()
