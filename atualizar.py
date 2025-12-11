from conectar import connect_db


# =============================
# FUNCIONÁRIO
# =============================
def update_funcionario(dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
            UPDATE funcionario
            SET nome = %s, cargo = %s, turno = %s
            WHERE id_funcionario = %s
        """

        valores = (
            dados["nome"],
            dados["cargo"],
            dados["turno"],
            dados["id_funcionario"]
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"status": "sucesso", "funcionario_atualizado": cursor.rowcount}

    except Exception as e:
        return {"status": "erro", "mensagem": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# CLIENTE
# =============================
def update_cliente(dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
            UPDATE cliente
            SET nome = %s, cpf = %s
            WHERE id_cliente = %s
        """

        valores = (
            dados["nome"],
            dados["cpf"],
            dados["id_cliente"]
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"status": "sucesso", "cliente_atualizado": cursor.rowcount}

    except Exception as e:
        return {"status": "erro", "mensagem": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# FORNECEDOR
# =============================
def update_fornecedor(dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
            UPDATE fornecedor
            SET nome = %s, cnpj = %s
            WHERE id_fornecedor = %s
        """

        valores = (
            dados["nome"],
            dados["cnpj"],
            dados["id_fornecedor"]
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"status": "sucesso", "fornecedor_atualizado": cursor.rowcount}

    except Exception as e:
        return {"status": "erro", "mensagem": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# ITEM ENTRADA
# =============================
def update_itemEntrada(dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Verifica se existe
        cursor.execute(
            "SELECT COUNT(*) FROM itementrada WHERE id_itemEntrada = %s",
            (dados["id_itemEntrada"],)
        )
        if cursor.fetchone()[0] == 0:
            return {"status": "erro", "mensagem": "ItemEntrada não encontrado"}

        # Verifica FK produto
        cursor.execute(
            "SELECT COUNT(*) FROM produto WHERE id_produto = %s",
            (dados["produto_id_produto"],)
        )
        if cursor.fetchone()[0] == 0:
            return {"status": "erro", "mensagem": "Produto não existe"}

        sql = """
        UPDATE itementrada
        SET data_entrada = %s, qtd = %s, produto_id_produto = %s
        WHERE id_itemEntrada = %s
        """

        valores = (
            dados["data_entrada"],
            dados["qtd"],
            dados["produto_id_produto"],
            dados["id_itemEntrada"]
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"status": "sucesso", "mensagem": "ItemEntrada atualizado"}

    except Exception as e:
        return {"status": "erro", "mensagem": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# ITEM SAÍDA
# =============================
def atualizar_itemsaida(id_itemsaida, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE itemsaida
        SET data_itemsaida = %s,
            qtd = %s,
            produto_id_produto = %s,
            pedido_saida_id_pedido_saida = %s
        WHERE id_itemsaida = %s
        """

        valores = (
            dados['data_itemsaida'],
            dados['qtd'],
            dados['produto_id_produto'],
            dados['pedido_saida_id_pedido_saida'],
            id_itemsaida
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Item de saída atualizado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# LOCALIZAÇÃO
# =============================
def atualizar_localizacao(id_localizacao, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE localizacao
        SET rua = %s,
            prateleira = %s,
            nivel = %s,
            numeracao = %s
        WHERE id_localizacao = %s
        """

        valores = (
            dados['rua'],
            dados['prateleira'],
            dados['nivel'],
            dados['numeracao'],
            id_localizacao
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Localização atualizada com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# PEDIDO ENTRADA
# =============================
def atualizar_pedido_entrada(id_pedido_entrada, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE pedido_entrada
        SET data = %s,
            status = %s,
            fornecedor_id_fornecedor = %s,
            transportadora_id_transportadora = %s,
            funcionario_id_funcionario = %s,
            itemEntrada_id_itemEntrada = %s
        WHERE id_pedido_entrada = %s
        """

        valores = (
            dados['data'],
            dados['status'],
            dados['fornecedor_id_fornecedor'],
            dados['transportadora_id_transportadora'],
            dados['funcionario_id_funcionario'],
            dados['itemEntrada_id_itemEntrada'],
            id_pedido_entrada
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Pedido de entrada atualizado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# PEDIDO SAÍDA
# =============================
def atualizar_pedido_saida(id_pedido_saida, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE pedido_saida
        SET data = %s,
            status = %s,
            transportadora_id_transportadora = %s,
            funcionario_id_funcionario = %s,
            cliente_id_cliente = %s
        WHERE id_pedido_saida = %s
        """

        valores = (
            dados['data'],
            dados['status'],
            dados['transportadora_id_transportadora'],
            dados['funcionario_id_funcionario'],
            dados['cliente_id_cliente'],
            id_pedido_saida
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Pedido de saída atualizado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# PRODUTO
# =============================
def atualizar_produto(id_produto, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE produto
        SET nome_produto = %s,
            categoria = %s,
            preco = %s,
            localizacao_id_localizacao = %s
        WHERE id_produto = %s
        """

        valores = (
            dados['nome_produto'],
            dados['categoria'],
            dados['preco'],
            dados['localizacao_id_localizacao'],
            id_produto
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Produto atualizado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# SENSOR
# =============================
def atualizar_sensor(id_sensor, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE sensor
        SET tipo = %s,
            descricao = %s,
            localizacao_id_localizacao = %s
        WHERE id_sensor = %s
        """

        valores = (
            dados['tipo'],
            dados['descricao'],
            dados['localizacao_id_localizacao'],
            id_sensor
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Sensor atualizado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# =============================
# TRANSPORTADORA
# =============================
def atualizar_transportadora(id_transportadora, dados):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE transportadora
        SET nome = %s,
            cnpj = %s
        WHERE id_transportadora = %s
        """

        valores = (
            dados['nome'],
            dados['cnpj'],
            id_transportadora
        )

        cursor.execute(sql, valores)
        conn.commit()

        return {"mensagem": "Transportadora atualizada com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()
