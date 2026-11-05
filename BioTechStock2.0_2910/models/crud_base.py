from core.database import conectar


# Classe base para operações de CRUD
class CrudBase:
    """
    Classe base para operações genéricas de CRUD.

    Essa classe pode ser reaproveitada por cadastros simples, como:
    - produto
    - localização
    - sensor
    - usuários

    Cada classe filha informa:
    - nome da tabela
    - chave primária
    - campos permitidos
    """

    # Inicializa as configurações da classe
    def __init__(self, tabela, chave_primaria, campos):
        self.tabela = tabela
        self.chave_primaria = chave_primaria
        self.campos = campos

    # Lista todos os registros
    def listar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = f"SELECT * FROM {self.tabela}"
        cursor.execute(sql)

        dados = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return dados

    # Busca um registro pelo ID
    def buscar_por_id(self, id_registro):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = f"""
            SELECT *
            FROM {self.tabela}
            WHERE {self.chave_primaria} = %s
        """

        cursor.execute(sql, (id_registro,))
        registro = cursor.fetchone()

        # Fecha a conexão
        cursor.close()
        conexao.close()

        return registro

    # Insere um novo registro
    def inserir(self, dados):
        conexao = conectar()
        cursor = conexao.cursor()

        campos_validos = []
        valores = []

        # Verifica quais campos foram enviados
        for campo in self.campos:
            if campo in dados:
                campos_validos.append(campo)
                valores.append(dados[campo])

        colunas = ", ".join(campos_validos)
        marcadores = ", ".join(["%s"] * len(campos_validos))

        sql = f"""
            INSERT INTO {self.tabela} ({colunas})
            VALUES ({marcadores})
        """

        print(sql)
        print(valores)

        cursor.execute(sql, valores)
        conexao.commit()

        # Pega o ID do registro criado
        novo_id = cursor.lastrowid

        cursor.close()
        conexao.close()

        return novo_id

    # Atualiza um registro pelo ID
    def atualizar(self, id_registro, dados):
        conexao = conectar()
        cursor = conexao.cursor()

        campos_update = []
        valores = []

        # Monta os campos que serão atualizados
        for campo in self.campos:
            if campo in dados:
                campos_update.append(f"{campo} = %s")
                valores.append(dados[campo])

        valores.append(id_registro)

        sql = f"""
            UPDATE {self.tabela}
            SET {", ".join(campos_update)}
            WHERE {self.chave_primaria} = %s
        """

        cursor.execute(sql, valores)
        conexao.commit()

        cursor.close()
        conexao.close()

    # Exclui um registro pelo ID
    def excluir(self, id_registro):
        conexao = conectar()
        cursor = conexao.cursor()

        sql = f"""
            DELETE FROM {self.tabela}
            WHERE {self.chave_primaria} = %s
        """

        cursor.execute(sql, (id_registro,))
        conexao.commit()

        cursor.close()
        conexao.close()

    # Conta a quantidade de registros
    def contar(self):
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)

        sql = f"SELECT COUNT(*) AS total FROM {self.tabela}"

        cursor.execute(sql)
        resultado = cursor.fetchone()

        cursor.close()
        conexao.close()

        return resultado["total"]
