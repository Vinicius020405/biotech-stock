from flask import Flask, render_template, request, redirect, session, flash, url_for
import pymysql
from datetime import timedelta
from cryptography.fernet import Fernet
from werkzeug.security import check_password_hash

app = Flask(__name__)
app.secret_key = 'chave-da-academia-123'  # Somente para trabalho local
app.permanent_session_lifetime = timedelta(minutes=30)

# Configuracao do banco. Alterar a senha conforme o MySQL do computador.
HOST = 'localhost'
USUARIO = 'root'
SENHA = '123456'
BANCO = 'academia_saep'

# pesquisei como criptografar CPF e usei essa chave no meu teste local
# (nao deve ser usada assim em um sistema publicado)
CHAVE_CPF = 'wxO_FPmABYEhJSxyaZiZTbR5FLAfJiBi4VYIxnEIjX4='
cifra = Fernet(CHAVE_CPF.encode())


def conectar():
    return pymysql.connect(host=HOST, user=USUARIO, password=SENHA,
                           database=BANCO, charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)


def buscar(sql, dados=()):
    conexao = conectar()
    with conexao.cursor() as cursor:
        cursor.execute(sql, dados)
        resultado = cursor.fetchall()
    conexao.close()
    return resultado


def salvar(sql, dados=()):
    conexao = conectar()
    try:
        cursor = conexao.cursor()
        cursor.execute(sql, dados)
        conexao.commit()
        cursor.close()
        conexao.close()
        return True
    except Exception:
        conexao.rollback()
        conexao.close()
        return False


@app.before_request
def ver_login():
    if request.endpoint not in ('login', 'static') and 'id_usuario' not in session:
        return redirect(url_for('login'))


@app.context_processor
def nome_usuario():
    return {'nome_usuario': session.get('nome', '')}


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '')
        senha = request.form.get('senha', '')
        usuarios = buscar('SELECT * FROM usuarios WHERE email=%s', (email,))
        if usuarios and check_password_hash(usuarios[0]['senha_hash'], senha):
            session.clear()
            session.permanent = True
            session['id_usuario'] = usuarios[0]['id']
            session['nome'] = usuarios[0]['nome']
            return redirect('/painel')
        flash('Email ou senha errados', 'danger')
    return render_template('login.html')


@app.route('/sair', methods=['POST'])
def sair():
    session.clear()
    return redirect('/')


@app.route('/painel')
def inicio():
    a = buscar('SELECT COUNT(*) total FROM alunos')[0]['total']
    p = buscar('SELECT COUNT(*) total FROM planos')[0]['total']
    ag = buscar('SELECT COUNT(*) total FROM agendamentos')[0]['total']
    return render_template('dashboard.html', contagens={'alunos': a, 'planos': p, 'agendamentos': ag})


@app.route('/alunos')
def listar_alunos():
    busca = request.args.get('q', '')
    lista = buscar('SELECT id,nome,email,telefone FROM alunos WHERE nome LIKE %s ORDER BY nome', ('%' + busca + '%',))
    return render_template('alunos.html', rows=lista, q=busca)


@app.route('/alunos/novo', methods=['GET','POST'])
@app.route('/alunos/<int:aluno_id>/editar', methods=['GET','POST'])
def salvar_aluno(aluno_id=None):
    antigo = None
    if aluno_id:
        dados = buscar('SELECT * FROM alunos WHERE id=%s', (aluno_id,))
        if dados: antigo = dados[0]
    if request.method == 'POST':
        nome = request.form.get('nome', '')
        cpf = request.form.get('cpf', '').replace('.', '').replace('-', '')
        email = request.form.get('email', '')
        telefone = request.form.get('telefone', '')  # fazer validacao depois
        if not nome or (not aluno_id and len(cpf) != 11):
            flash('Preencha nome e CPF com 11 numeros', 'danger')
        else:
            if aluno_id:
                if cpf:
                    ok = salvar('UPDATE alunos SET nome=%s, cpf_criptografado=%s, email=%s, telefone=%s WHERE id=%s',
                                  (nome, cifra.encrypt(cpf.encode()).decode(), email, telefone, aluno_id))
                else:
                    ok = salvar('UPDATE alunos SET nome=%s, email=%s, telefone=%s WHERE id=%s',
                                  (nome, email, telefone, aluno_id))
            else:
                ok = salvar('INSERT INTO alunos(nome,cpf_criptografado,email,telefone) VALUES(%s,%s,%s,%s)',
                              (nome, cifra.encrypt(cpf.encode()).decode(), email, telefone))
            if ok: return redirect('/alunos')
            flash('Nao foi possivel salvar', 'danger')
    return render_template('aluno_form.html', antigo=antigo)


@app.route('/alunos/<int:aluno_id>/excluir', methods=['POST'])
def excluir_aluno(aluno_id):
    if not salvar('DELETE FROM alunos WHERE id=%s', (aluno_id,)):
        flash('Aluno tem planos cadastrados ou ocorreu um erro', 'danger')
    return redirect('/alunos')


@app.route('/planos')
def listar_planos():
    lista = buscar('SELECT p.*, a.nome aluno FROM planos p JOIN alunos a ON p.aluno_id=a.id')
    return render_template('planos.html', rows=lista)


@app.route('/planos/novo', methods=['GET','POST'])
@app.route('/planos/<int:plano_id>/editar', methods=['GET','POST'])
def salvar_plano(plano_id=None):
    alunos = buscar('SELECT id,nome FROM alunos ORDER BY nome')
    antigo = None
    if plano_id:
        dados = buscar('SELECT * FROM planos WHERE id=%s', (plano_id,))
        if dados: antigo = dados[0]
    if request.method == 'POST':
        descricao = request.form.get('descricao', '')
        objetivo = request.form.get('objetivo', '')
        aluno = request.form.get('aluno_id', '')
        if descricao and aluno:
            if plano_id:
                ok = salvar('UPDATE planos SET descricao=%s, objetivo=%s, aluno_id=%s WHERE id=%s',
                              (descricao, objetivo, aluno, plano_id))
            else:
                ok = salvar('INSERT INTO planos(descricao,objetivo,aluno_id) VALUES(%s,%s,%s)',
                              (descricao, objetivo, aluno))
            if ok: return redirect('/planos')
        flash('Confira os campos', 'danger')
    return render_template('plano_form.html', antigo=antigo, alunos=alunos)


@app.route('/planos/<int:plano_id>/excluir', methods=['POST'])
def excluir_plano(plano_id):
    if not salvar('DELETE FROM planos WHERE id=%s', (plano_id,)):
        flash('Plano utilizado em agendamentos ou erro no banco', 'danger')
    return redirect('/planos')


@app.route('/agendamentos')
def listar_agendamentos():
    lista = buscar("""SELECT ag.*, a.nome aluno, a.email, a.telefone,
                              p.descricao plano, p.objetivo
                       FROM agendamentos ag JOIN planos p ON ag.plano_id=p.id
                       JOIN alunos a ON p.aluno_id=a.id ORDER BY ag.data, ag.horario""")
    return render_template('agendamentos.html', rows=lista)


@app.route('/agendamentos/novo', methods=['GET','POST'])
@app.route('/agendamentos/<int:ag_id>/editar', methods=['GET','POST'])
def salvar_agendamento(ag_id=None):
    planos = buscar('SELECT p.id,p.descricao,a.nome aluno FROM planos p JOIN alunos a ON p.aluno_id=a.id')
    antigo = None
    if ag_id:
        dados = buscar('SELECT * FROM agendamentos WHERE id=%s', (ag_id,))
        if dados:
            antigo = dados[0]
            antigo['horario'] = str(antigo['horario'])[:5]
    if request.method == 'POST':
        plano = request.form.get('plano_id', '')
        data = request.form.get('data', '')
        hora = request.form.get('horario', '')
        observacao = request.form.get('observacao', '')
        # nao consegui fazer a verificacao de horarios repetidos
        if plano and data and hora:
            if ag_id:
                ok = salvar('UPDATE agendamentos SET plano_id=%s,data=%s,horario=%s,observacao=%s WHERE id=%s',
                              (plano, data, hora, observacao, ag_id))
            else:
                ok = salvar('INSERT INTO agendamentos(plano_id,data,horario,observacao) VALUES(%s,%s,%s,%s)',
                              (plano, data, hora, observacao))
            if ok: return redirect('/agendamentos')
        flash('Confira o agendamento', 'danger')
    return render_template('ag_form.html', antigo=antigo, planos=planos)


@app.route('/agendamentos/<int:ag_id>/excluir', methods=['POST'])
def excluir_agendamento(ag_id):
    salvar('DELETE FROM agendamentos WHERE id=%s', (ag_id,))
    return redirect('/agendamentos')


if __name__ == '__main__':
    app.run(debug=True)
