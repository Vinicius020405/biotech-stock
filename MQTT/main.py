
"""
main.py

API IoT - SENAI / BIOTECH STOCK

Arquitetura:

ESP32
   |
HiveMQ Cloud
   |
MQTT Manager
   |
MySQL
   |
FastAPI
   |
Dashboard HTML

Sensores:
- DHT11
- HC-SR04
- MFRC522

Funcionalidades:
- Receber dados dos sensores via MQTT
- Consultar leituras no MySQL
- Identificar medicamentos pelo UID RFID
- Mostrar quantidade em estoque
- Abrir o dashboard pelo navegador
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from mqtt_manager import mqtt_manager
from database import criar_tabela, listar_leituras, pool


# =====================================================
# CICLO DE VIDA DA API
# =====================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print()
    print("================================")
    print("   API IOT - BIOTECH STOCK")
    print("================================")

    print()
    print("Inicializando banco de dados...")

    # Verifica/cria a tabela de leituras
    criar_tabela()

    print()
    print("Inicializando MQTT Manager...")

    # Conecta ao HiveMQ
    mqtt_manager.start()

    print()
    print("================================")
    print("SISTEMA INICIALIZADO")
    print("================================")

    print()
    print("FastAPI: OK")
    print("MySQL:   OK")
    print("MQTT:    iniciando")

    print()
    print("Aguardando dados dos sensores...")

    # Mantem a API executando
    try:
        yield

    finally:
        print()
        print("Encerrando sistema...")

        mqtt_manager.stop()

        print("Sistema encerrado.")


# =====================================================
# CRIAR FASTAPI
# =====================================================

app = FastAPI(
    title="API IoT - BioTech Stock",

    description=(
        "API para monitoramento dos sensores "
        "DHT11, HC-SR04 e MFRC522, "
        "com identificacao de medicamentos RFID."
    ),

    version="1.1.0",

    lifespan=lifespan
)

# =====================================================
# PERMITIR CONEXÃO COM O DASHBOARD
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# ROTA PRINCIPAL
# =====================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "projeto": "BioTech Stock",
        "sensores": [
            "DHT11",
            "HC-SR04",
            "MFRC522"
        ],
        "dashboard": "/dashboard",
        "estoque_rfid": "/rfid/estoque"
    }


# =====================================================
# LISTAR TODAS AS LEITURAS
# =====================================================

@app.get("/leituras")
def get_leituras(
    device_id: str = None,
    sensor: str = None,
    limite: int = Query(
        default=100,
        ge=1,
        le=1000
    )
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor=sensor,
        limite=limite
    )

    return {
        "quantidade": len(resultado),

        "filtros": {
            "device_id": device_id,
            "sensor": sensor,
            "limite": limite
        },

        "leituras": resultado
    }


# =====================================================
# ROTA DHT11
# =====================================================

@app.get("/sensores/dht11")
def get_dht11(
    device_id: str = None,
    limite: int = Query(
        default=100,
        ge=1,
        le=1000
    )
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor="DHT11",
        limite=limite
    )

    return {
        "sensor": "DHT11",
        "quantidade": len(resultado),
        "leituras": resultado
    }


# =====================================================
# ROTA HC-SR04
# =====================================================

@app.get("/sensores/hc-sr04")
def get_hcsr04(
    device_id: str = None,
    limite: int = Query(
        default=100,
        ge=1,
        le=1000
    )
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor="HC-SR04",
        limite=limite
    )

    return {
        "sensor": "HC-SR04",
        "quantidade": len(resultado),
        "leituras": resultado
    }


# =====================================================
# ROTA MFRC522
# =====================================================

@app.get("/sensores/mfrc522")
def get_mfrc522(
    device_id: str = None,
    limite: int = Query(
        default=100,
        ge=1,
        le=1000
    )
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor="MFRC522",
        limite=limite
    )

    return {
        "sensor": "MFRC522",
        "quantidade": len(resultado),
        "leituras": resultado
    }


# =====================================================
# ULTIMA LEITURA DHT11
# =====================================================

@app.get("/sensores/dht11/ultima")
def ultima_dht11(
    device_id: str = None
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor="DHT11",
        limite=1
    )

    if not resultado:
        return {
            "sensor": "DHT11",
            "leitura": None
        }

    return {
        "sensor": "DHT11",
        "leitura": resultado[0]
    }


# =====================================================
# ULTIMA LEITURA HC-SR04
# =====================================================

@app.get("/sensores/hc-sr04/ultima")
def ultima_hcsr04(
    device_id: str = None
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor="HC-SR04",
        limite=1
    )

    if not resultado:
        return {
            "sensor": "HC-SR04",
            "leitura": None
        }

    return {
        "sensor": "HC-SR04",
        "leitura": resultado[0]
    }


# =====================================================
# ULTIMA LEITURA RFID
# =====================================================

@app.get("/sensores/mfrc522/ultima")
def ultima_mfrc522(
    device_id: str = None
):

    resultado = listar_leituras(
        device_id=device_id,
        sensor="MFRC522",
        limite=1
    )

    if not resultado:
        return {
            "sensor": "MFRC522",
            "leitura": None
        }

    return {
        "sensor": "MFRC522",
        "leitura": resultado[0]
    }


# =====================================================
# RFID - CONSULTAR MEDICAMENTOS E ESTOQUE
# =====================================================

@app.get("/rfid/estoque")
def consultar_estoque_rfid():

    conexao = None
    cursor = None

    try:
        conexao = pool.get_connection()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                l.id,
                l.device_id,
                l.rfid_uid AS uid,

                COALESCE(
                    p.nome,
                    'Cartao nao cadastrado'
                ) AS medicamento,

                p.quantidade,
                l.timestamp

            FROM leituras l

            LEFT JOIN produtos_rfid p
                ON l.rfid_uid = p.uid

            WHERE l.sensor = 'MFRC522'

            ORDER BY l.id DESC

            LIMIT 20
        """)

        resultados = cursor.fetchall()

        for item in resultados:
            if item["timestamp"] is not None:
                item["timestamp"] = (
                    item["timestamp"].isoformat()
                )

        return {
            "quantidade": len(resultados),
            "leituras": resultados
        }

    finally:
        if cursor is not None:
            cursor.close()

        if conexao is not None:
            conexao.close()


# =====================================================
# RFID - ULTIMO MEDICAMENTO IDENTIFICADO
# =====================================================

@app.get("/rfid/ultimo")
def ultimo_medicamento_rfid():

    conexao = None
    cursor = None

    try:
        conexao = pool.get_connection()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                l.id,
                l.device_id,
                l.rfid_uid AS uid,

                COALESCE(
                    p.nome,
                    'Cartao nao cadastrado'
                ) AS medicamento,

                p.quantidade,
                l.timestamp

            FROM leituras l

            LEFT JOIN produtos_rfid p
                ON l.rfid_uid = p.uid

            WHERE l.sensor = 'MFRC522'

            ORDER BY l.id DESC

            LIMIT 1
        """)

        resultado = cursor.fetchone()

        if resultado is None:
            return {
                "sensor": "MFRC522",
                "leitura": None
            }

        if resultado["timestamp"] is not None:
            resultado["timestamp"] = (
                resultado["timestamp"].isoformat()
            )

        return {
            "sensor": "MFRC522",
            "leitura": resultado
        }

    finally:
        if cursor is not None:
            cursor.close()

        if conexao is not None:
            conexao.close()


# =====================================================
# LISTAR MEDICAMENTOS CADASTRADOS
# =====================================================

@app.get("/medicamentos")
def listar_medicamentos():

    conexao = None
    cursor = None

    try:
        conexao = pool.get_connection()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                uid,
                nome,
                quantidade
            FROM produtos_rfid
            ORDER BY nome ASC
        """)

        produtos = cursor.fetchall()

        return {
            "quantidade": len(produtos),
            "medicamentos": produtos
        }

    finally:
        if cursor is not None:
            cursor.close()

        if conexao is not None:
            conexao.close()


# =====================================================
# ABRIR DASHBOARD BIOTECH STOCK
# =====================================================

@app.get("/dashboard", include_in_schema=False)
def abrir_dashboard():

    caminho = (
        Path(__file__).resolve().parent
        / "index.html"
    )

    return FileResponse(
        caminho,
        media_type="text/html"
    )
