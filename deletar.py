import mysql.connector
from conectar import connect_db

# ===================== FUNCIONÁRIO =====================

def deleta_funcionario(funcionario_id):
    conn = connect_db()
    if not conn:
        return {"status": "erro", "mensagem": "Falha na conexão com o banco"}

    try:
        cursor = conn.cursor()
        sql = "DELETE FROM funcionario WHERE id_funcionario = %s"
        cursor.execute(sql, (funcionario_id,))
        conn.commit()
        return {'status': 'sucesso', 'mensagem': f"Funcionário {funcionario_id} excluído com sucesso."}

    except mysql.connector.Error as err:
        return {'status': 'erro', 'mensagem': f"Erro ao excluir funcionário: {err}"}

    finally:
        cursor.close()
        conn.close()


# ===================== CLIENTE =====================

def deleta_cliente(cliente_id):
    conn = connect_db()
    if not conn:
        return {"status": "erro", "mensagem": "Falha na conexão com o banco"}

    try:
        cursor = conn.cursor()
        sql = "DELETE FROM cliente WHERE id_cliente = %s"
        cursor.execute(sql, (cliente_id,))
        conn.commit()
        return {'status': 'sucesso', 'mensagem': f"Cliente {cliente_id} excluído com sucesso."}

    except mysql.connector.Error as err:
        return {'status': 'erro', 'mensagem': f"Erro ao excluir cliente: {err}"}

    finally:
        cursor.close()
        conn.close()


# ===================== FORNECEDOR =====================

def deleta_fornecedor(fornecedor_id):
    conn = connect_db()

    try:
        cursor = conn.cursor()
        sql = "DELETE FROM fornecedor WHERE id_fornecedor = %s"
        cursor.execute(sql, (fornecedor_id,))
        conn.commit()
        return {'status': 'sucesso', 'mensagem': f"Fornecedor {fornecedor_id} excluído com sucesso."}

    except mysql.connector.Error as err:
        return {'status': 'erro', 'mensagem': f"Erro ao excluir fornecedor: {err}"}

    finally:
        cursor.close()
        conn.close()


# ===================== ITEM ENTRADA =====================

def deleta_itemEntrada(item_id):
    conn = connect_db()
    try:
        cursor = conn.cursor()

        # Verifica se existe antes de deletar
        cursor.execute("SELECT COUNT(*) FROM itementrada WHERE id_itemEntrada = %s", (item_id,))
        if cursor.fetchone()[0] == 0:
            return {"status": "erro", "mensagem": "ItemEntrada não encontrado"}

        cursor.execute("DELETE FROM itementrada WHERE id_itemEntrada = %s", (item_id,))
        conn.commit()
        return {"status": "sucesso", "mensagem": "ItemEntrada excluído com sucesso"}

    except mysql.connector.Error as err:
        return {"status": "erro", "mensagem": str(err)}

    finally:
        cursor.close()
        conn.close()


# ===================== ITEM SAÍDA =====================

def deletar_itemsaida(id_itemsaida):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM itemsaida WHERE id_itemsaida = %s", (id_itemsaida,))
        conn.commit()

        return {"mensagem": "Item de saída deletado!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== LOCALIZAÇÃO =====================

def deletar_localizacao(id_localizacao):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM localizacao WHERE id_localizacao = %s", (id_localizacao,))
        conn.commit()

        return {"mensagem": "Localização deletada com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== PEDIDO ENTRADA =====================

def deletar_pedido_entrada(id_pedido_entrada):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM pedido_entrada WHERE id_pedido_entrada = %s", (id_pedido_entrada,))
        conn.commit()

        return {"mensagem": "Pedido de entrada deletado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== PEDIDO SAÍDA =====================

def deletar_pedido_saida(id_pedido_saida):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM pedido_saida WHERE id_pedido_saida = %s", (id_pedido_saida,))
        conn.commit()

        return {"mensagem": "Pedido de saída deletado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== PRODUTO =====================

def deletar_produto(id_produto):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM produto WHERE id_produto = %s", (id_produto,))
        conn.commit()

        return {"mensagem": "Produto deletado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== SENSOR =====================

def deletar_sensor(id_sensor):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM sensor WHERE id_sensor = %s", (id_sensor,))
        conn.commit()

        return {"mensagem": "Sensor deletado com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()


# ===================== TRANSPORTADORA =====================

def deletar_transportadora(id_transportadora):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM transportadora WHERE id_transportadora = %s", (id_transportadora,))
        conn.commit()

        return {"mensagem": "Transportadora deletada com sucesso!"}

    except Exception as e:
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()
