import mysql.connector


def connect_db():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="biotech"
        )
        return connection
    except mysql.connector.Error as err:
        print(f"erro ao conectar ao banco de dados: {err}")
        return None
