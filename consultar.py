from conectar import connect_db


def read_funcionario():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM funcionario")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def read_clientes():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM cliente")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def read_fornecedores():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM fornecedor")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def read_itemEntrada():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM itementrada")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_itemsaida():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM itemsaida")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_localizacao():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM localizacao")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_pedido_entrada():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM pedido_entrada")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_pedido_saida():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM pedido_saida")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_produto():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM produto")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_sensor():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM sensor")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


def consultar_transportadora():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM transportadora")
        return cursor.fetchall()
    except Exception as e:
        return {"erro": str(e)}
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
