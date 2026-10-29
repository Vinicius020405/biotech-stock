from models.crud_base import CrudBase 
from core.database import conectar 
 
 
# Modelo responsável pelos sensores
class SensorModel(CrudBase): 
    def __init__(self): 
        # Define a tabela e os campos do sensor
        super().__init__( 
            tabela="cadastro_sensor", 
            chave_primaria="id_sensor", 
            campos=[ 
                "nome", 
                "tipo_sensor", 
                "codigo_sensor", 
                "id_localizacao", 
                "id_produto", 
                "status" 
            ] 
        ) 
 
    # Registra os dados recebidos pelo sensor
    def registrar_dados_sensor(self, dados): 
         
        # Conecta ao banco
        conexao = conectar() 
        cursor = conexao.cursor() 
 
        sql = """ 
            INSERT INTO dados_sensor 
            (id_sensor, valor, unidade) 
            VALUES (%s, %s, %s) 
        """ 
 
        # Monta os valores para inserir
        valores = ( 
            dados.get("id_sensor"), 
            dados.get("valor"), 
            dados.get("unidade") 
        ) 
 
        cursor.execute(sql, valores) 
        conexao.commit() 
 
        # Fecha a conexão
        cursor.close() 
        conexao.close()
