# --- 1. VALIDAR ID TRANSPORTADORA 
def validar_id_transportadora(dados):
    if "id" not in dados:
        return False
    valor_id = str(dados["id"])
    if not valor_id.isdigit():
        return False
    if len(valor_id) != 6:
        return False
    return True




# ---  2. nome transportadora       

def validar_nome_transportadora(dados):
    if "nome" in dados:
        nome = str(dados["nome"]).strip()

        if len(nome) >= 3 and not nome.isdigit():
            return True
        else:
            return False
    return False







# --- 6.  sensor

def validar_sensor(dados):
    sensores_validos = [
        "Termistor NTC",
        "Sensor de Presença PIR",
        "LDR",
        "Sensor Indutivo de Proximidade",
        "Sensor de Movimento PIR",
        "DHT11",
        "Sensor de Vazão tipo Turbina",
        "Pressostato",
        "Sensor de Gás MQ-x",
        "Célula de Carga"
    ]

 
    if "nome" not in dados:
        return False

    nome_sensor = dados["nome"].strip().lower()
    sensores_validos_lower = [s.lower() for s in sensores_validos]

    return nome_sensor in sensores_validos_lower





# --- 7. sensor


def validar_tipo_sensor(dados):
    tipos_validos = {
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

    
    if "tipo" not in dados:
        return False

    valor = dados["tipo"]

    
    try:
        valor_int = int(valor)
        return valor_int in tipos_validos
    except:
        
        valor_str = str(valor).lower().strip()
        return valor_str in tipos_validos.values()
    return False
    



# --- 8. status
def validar_status(dados):
  
    status_validos = [
        "ativo",
        "inativo",
        "em manutenção",
        "falha",
        "desconectado",
        "teste",
        "pendente",
        "alerta",
        "em uso",
        "desligado"
    ]

    if "status" not in dados:
        return False

    status_item = dados["status"].strip().lower()
    return status_item in [s.lower() for s in status_validos]



#--- descrição

def validar_descricao(dados):

    descricoes_validas = [
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

    if "descricao" not in dados:
        return False

    desc = dados["descricao"].strip().lower()
    return desc in [d.lower() for d in descricoes_validas]






# --- 10. id_item

def validar_id_item(dados):
    if "id" in dados:
        id = dados["id"]

        id_str = str(id)

        if id_str.isdigit() and len(id_str) == 6:
            return True
        else:
            return False
        




# --- iten entrada quantidade

def validar_quantidade(dados):
   
    if "quantidade" not in dados:
        return False

    try:
        qtd = int(dados["quantidade"])
        return qtd > 0
    except:
        return False

        



# --- iten saida quantidade

def validar_quantidade_saida(dados):
    if "quantidade" not in dados:
        return False
    try:
        qtd = int(dados["quantidade"])
        return qtd > 0
    except:
        return False



#--- data saida

def validar_data_saida(dados):
    
    if "data" in dados:
        data = str(dados["data"]).strip()
        if len(data) == 10 and data[2] == "/" and data[5] == "/":
            return True
    return False



#--- data entrada

def validar_data_entrada(dados):
    
    if "data" in dados:
        data = str(dados["data"]).strip()
        if len(data) == 10 and data[2] == "/" and data[5] == "/":
            return True
    return False


        
# --- 11. id_pedido

def validar_id_pedidos(dados):
    if "id" in dados:
        id = dados["id"]

        id_str = str(id)

        if id_str.isdigit() and len(id_str) == 6:
            return True
        else:
            return False
        



        
# --- 12. id_produto
def validar_id_produto(dados):
    if "id" in dados:
        id_produto = dados["id"]
        id_produto_str = str(id_produto)

        if id_produto_str.isdigit() and len(id_produto_str) == 6:
            return True
    return False





# --- 13.quantidade_lista
def validar_quantidade_lista(dados):
    if "quantidade" in dados:
        quantidade = dados["quantidade"]
        if isinstance(quantidade, str) and quantidade.isdigit():
            return True
        else:
            return False
    else:
        return False
    



    
# --- 14. preco_medio
def validar_preco_medio(dados):
    if "preco_medio" not in dados:
        return False

    preco = dados["preco_medio"]

    try:
        float(preco)
        return True
    except:
        return False
    




# --- 15. produto
def validar_produto(dados):
    if "produto" in dados:
        produto = str(dados["produto"])
        if len(produto) >= 3:
            return True
    return False




# --- 16. tipo produto 
def validar_tipo_produto(dados):
    opcoes_validas = ["oral", "nasal", "intravenosa", "intramuscular", "tópica", "sublingual"]

    if "tipo_produto" in dados:
        tipo = str(dados["tipo_produto"]).lower().strip()
        return tipo in opcoes_validas

    return False

    

    
# --- 17. preco_medio2
def validar_p_medio2(dados):
    if "preco_medio2" not in dados:
        return False

    preco = dados["preco_medio2"]

    try:
        preco = float(preco)
        return preco > 0
    except (ValueError, TypeError):
        return False
    



# --- 18. clientes_nome

def validar_cliente(dados):
    
    if "nome" in dados:
        nome = str(dados["nome"]).strip()
        if len(nome) >= 3 and not nome.isdigit():
            return True
    return False





# --- 19. clientes_data 

def validar_cliente_data(dados):
    
    if "data" in dados:
        data = str(dados["data"]).strip()
        if len(data) == 10 and data[2] == "/" and data[5] == "/":
            return True
    return False






# --- 20. clientes_telefone
def validar_cliente_telefone(dados):
   
    if "telefone" in dados:
        telefone = str(dados["telefone"]).strip()
        if telefone.isdigit() and len(telefone) in [10, 11]:
            return True
    return False





# --- 21. estoque 

def validar_estoque(dados):
    
    if "id" in dados:
        valor = str(dados["id"]).strip()
        if valor.isdigit():
            return True
    return False






# --- 22. produto_detalhes 
def validar_produto_detalhes(dados):
    
    if "produto" in dados:
        produto = str(dados["produto"]).strip()
        if len(produto) >= 3 and not produto.isdigit():
            return True
    return False





# --- 23. quantidade_atual
def validar_qtd_atual(dados):
    
    if "quantidade" in dados:
        qtd = str(dados["quantidade"]).strip()
        if qtd.isdigit() and int(qtd) >= 0:
            return True
    return False




# --- 24. locais 
def validar_locais(dados):
    
    if "local" in dados:
        local = str(dados["local"]).strip()
        if len(local) >= 2:
            return True
    return False




# --- 25. nivel_minimo
def validar_niv_min(dados):
    
    if "nivel" in dados:
        nivel = str(dados["nivel"]).strip()
        if nivel.isdigit() and int(nivel) >= 0:
            return True
    return False





# --- 26. Validar_fornecedor

def validar_fornecedor (dados):
    if "fornecedor" in dados:
        fonecedor = str(dados["fornecedor"])
        if len(fonecedor) >= 3:
            return True
    return False






# --- 27. validar_cpf - TOKEN
import requests

TOKEN = "22452|eGBmfQgXtcuCVLtX0pH4Kuuy5EqVinzS"

def validar_cpf(cpf):
    url = f"https://api.invertexto.com/v1/validator?token={TOKEN}&value={cpf}&type=cpf"

    try:
        resposta = requests.get(url)

        if resposta.status_code == 200:
            return resposta.json()
        else:
            return {"erro": "CPF inválido ou problema na API"}
    
    except:
        return {"erro": "Falha na requisição"}




# --- 28. Fornecedor 

import requests

TOKEN = "22452|eGBmfQgXtcuCVLtX0pH4Kuuy5EqVinzS"

def validar_cnpj(cnpj):
    url = f"https://api.invertexto.com/v1/validator?token={TOKEN}&value={cnpj}&type=cnpj"

    try:
        resposta = requests.get(url)

        if resposta.status_code == 200:
            return resposta.json()
        else:
            return {"erro": "CNPJ inválido ou problema na API"}
    
    except:
        return {"erro": "Falha na requisição"}