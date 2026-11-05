import mysql.connector


# Modelo responsável pelas notificações
class NotificacaoModel:

    # Lista todas as notificações
    def listar(self):

        # Conecta ao banco de dados
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="estoque_sensores"
        )

        cursor = conexao.cursor(dictionary=True)

        # Busca as notificações mais recentes primeiro
        sql = """
            SELECT *
            FROM notificacao
            ORDER BY data_hora DESC
        """

        cursor.execute(sql)

        notificacoes = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return notificacoes

    # Conta as notificações que ainda não foram lidas
    def contar_nao_lidas(self):

        # Conecta ao banco de dados
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="estoque_sensores"
        )

        cursor = conexao.cursor()

        # Conta as notificações não lidas
        sql = """
            SELECT COUNT(*)
            FROM notificacao
            WHERE lida = 0
        """

        cursor.execute(sql)

        quantidade = cursor.fetchone()[0]

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return quantidade

    # Cria uma nova notificação
    def criar(self, titulo, mensagem):

        # Conecta ao banco de dados
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="estoque_sensores"
        )

        cursor = conexao.cursor()

        # Insere a nova notificação
        sql = """
            INSERT INTO notificacao
            (titulo, mensagem)
            VALUES (%s, %s)
        """

        cursor.execute(sql, (titulo, mensagem))

        conexao.commit()

        # Fecha a conexão
        cursor.close()
        conexao.close()

    # Marca uma notificação como lida
    def marcar_como_lida(self, id_notificacao):

        # Conecta ao banco de dados
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="estoque_sensores"
        )

        cursor = conexao.cursor()

        # Atualiza a notificação
        sql = """
            UPDATE notificacao
            SET lida = 1
            WHERE id_notificacao = %s
        """

        cursor.execute(sql, (id_notificacao,))

        conexao.commit()

        # Fecha a conexão
        cursor.close()
        conexao.close()

    # Marca todas as notificações como lidas
    def marcar_todas_como_lidas(self):

        # Conecta ao banco de dados
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="estoque_sensores"
        )

        cursor = conexao.cursor()

        # Atualiza todas as notificações não lidas
        sql = """
            UPDATE notificacao
            SET lida = 1
            WHERE lida = 0
        """

        cursor.execute(sql)

        conexao.commit()

        # Fecha a conexão
        cursor.close()
        conexao.close()
