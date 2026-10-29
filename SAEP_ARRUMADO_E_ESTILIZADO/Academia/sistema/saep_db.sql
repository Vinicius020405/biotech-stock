-- Trabalho de aluno - Academia - MySQL 8+
-- Antes de executar: ajustar o usuário e a senha usados pelo Python.
CREATE DATABASE IF NOT EXISTS academia_saep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academia_saep;

CREATE TABLE IF NOT EXISTS usuarios (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 email VARCHAR(120) NOT NULL UNIQUE,
 senha_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alunos (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 cpf_criptografado TEXT NOT NULL,
 email VARCHAR(120) NOT NULL UNIQUE,
 telefone VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS planos (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 descricao VARCHAR(120) NOT NULL,
 objetivo VARCHAR(120) NOT NULL,
 aluno_id INT NOT NULL,
 FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agendamentos (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 plano_id INT NOT NULL,
 data DATE NOT NULL,
 horario TIME NOT NULL,
 observacao TEXT,
 FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Dados iniciais são inseridos com: flask --app app popular
-- Usei Python porque senhas com hash e CPFs criptografados ficam diferentes a cada execução.

-- Exemplos de registros para apresentação
INSERT IGNORE INTO usuarios (id,nome,email,senha_hash) VALUES (1,'Administrador','admin@academia.local','pbkdf2:sha256:600000$619e1a5531c2bb51$ce99974749b7858b9eae599ad209e62ec683122c3505548d28b0db1b701428a6');
INSERT IGNORE INTO usuarios (id,nome,email,senha_hash) VALUES (2,'Recepcionista','recepcao@academia.local','pbkdf2:sha256:600000$ca21a14dc061f014$64c9bb44e8a4cffa8327b7d410711c2f72e0750fb61d422c303e0ff453bc3922');
INSERT IGNORE INTO usuarios (id,nome,email,senha_hash) VALUES (3,'Coordenador','coordenacao@academia.local','pbkdf2:sha256:600000$701c9af46c40646a$e6cec7e99ddccfb84d54a4162cd45478274d91d73db4050214cbb0bd4c350e81');
INSERT IGNORE INTO alunos (id,nome,cpf_criptografado,email,telefone) VALUES (1,'Ana Souza','gAAAAABq4MFk3aBRajQ33M2J4PKSxABBKkpSucCX1EvOcpkEzhDhqmbR_6uXNygG388KM7eCC0o7tV-FD7tLYtPrzF5R6Jc1KQ==','ana@exemplo.com','11911111111');
INSERT IGNORE INTO alunos (id,nome,cpf_criptografado,email,telefone) VALUES (2,'Bruno Lima','gAAAAABq4MFk7i_PCBRSZiLsAKYARGGAIbXqi2hPjVnR1hU57ayg4MPNOiK9ZUo_Ky-JkNqjYT7V8pSSyV2NZVJxqgE7N78d0w==','bruno@exemplo.com','11922222222');
INSERT IGNORE INTO alunos (id,nome,cpf_criptografado,email,telefone) VALUES (3,'Carla Rocha','gAAAAABq4MFkaEPXBwXbfRb5N5WDr31A43lP3CTCNs7hAgGzhtX6ZkKsUmiIq_TVWpOmMcv3THI9lZZIdKQV00ZXHpcyB45MkA==','carla@exemplo.com','11933333333');
INSERT IGNORE INTO planos (id,descricao,objetivo,aluno_id) VALUES (1,'Musculação A','Condicionamento',1);
INSERT IGNORE INTO planos (id,descricao,objetivo,aluno_id) VALUES (2,'Treino Funcional','Mobilidade',2);
INSERT IGNORE INTO planos (id,descricao,objetivo,aluno_id) VALUES (3,'Musculação B','Resistência',3);
INSERT IGNORE INTO agendamentos (id,plano_id,data,horario,observacao) VALUES (1,1,'2026-11-03','08:00','Avaliação inicial');
INSERT IGNORE INTO agendamentos (id,plano_id,data,horario,observacao) VALUES (2,2,'2026-11-04','09:30','Orientação de treino');
INSERT IGNORE INTO agendamentos (id,plano_id,data,horario,observacao) VALUES (3,3,'2026-11-05','14:00','Acompanhamento');
