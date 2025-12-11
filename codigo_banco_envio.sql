-- UTILIZAR O BANCO
USE biotech;


-- CLIENTE
-- INSERIR
INSERT INTO cliente (nome, cpf)
VALUES ('João Silva', '12345678900');
INSERT INTO cliente (nome, cpf)
VALUES ('Maria Oliveira', '98765432100');
INSERT INTO cliente (nome, cpf)
VALUES ('Carlos Souza', '11122233344');

-- SELECIONAR
SELECT * FROM cliente;
SELECT * FROM cliente WHERE cpf = '98765432100';
SELECT * FROM cliente WHERE nome LIKE '%Souza';

-- ATUALIZAR
UPDATE cliente
SET nome = 'João Pedro Silva'
WHERE id_cliente = 4;
UPDATE cliente
SET cpf = '99988877766'
WHERE id_cliente = 5;
UPDATE cliente
SET nome = 'Carlos Alberto Souza'
WHERE id_cliente = 6;

-- DELETAR
DELETE FROM cliente
WHERE id_cliente = 4;
DELETE FROM cliente
WHERE id_cliente = 5;
DELETE FROM cliente
WHERE id_cliente = 6;


-- FORNECEDOR
-- INSERIR
INSERT INTO fornecedor (nome,cnpj) VALUES
( 'Fornecedor A','12345567800019');
INSERT INTO fornecedor (nome,cnpj) VALUES
( 'Fornecedor C','23455678000190');
INSERT INTO fornecedor (nome,cnpj) VALUES
( 'Fornecedor B','98776543200015');

-- SELECIONAR
SELECT id_fornecedor, cnpj FROM fornecedor 	ORDER BY nome ASC;
SELECT * FROM fornecedor;
SELECT cnpj, nome FROM fornecedor where cnpj = '12345567800019';

-- ATUALIZAR
UPDATE fornecedor 
SET nome = 'Fornecedor Novo'
WHERE id_fornecedor = 6;
UPDATE fornecedor 
SET cnpj = '00011122000155'
WHERE id_fornecedor = 7;
UPDATE fornecedor 
SET nome = 'cristalia'
WHERE id_fornecedor = 8;

-- DELETAR
DELETE FROM fornecedor
WHERE id_fornecedor = 6;
DELETE FROM fornecedor
WHERE id_fornecedor = 7;
DELETE FROM fornecedor
WHERE id_fornecedor = 8;



-- FUNCIONARIO
-- INSERIR
INSERT INTO funcionario ( nome, cargo, turno)
VALUES ('Lucas Andrade', 'Engenheiro', 'Manhã');
INSERT INTO funcionario ( nome, cargo, turno)
VALUES ('Luiz', 'Analista', 'Tarde');
INSERT INTO funcionario (nome, cargo, turno)
VALUES ('Lucas', 'Gerente', 'Noite');

-- SELECIONAR
SELECT nome FROM funcionario WHERE nome = 'Lucas';
SELECT * FROM funcionario;
SELECT turno FROM funcionario WHERE cargo = 'Analista';

-- ATUALIZAR 
UPDATE funcionario
SET nome = 'Lucas Andrade'
WHERE id_funcionario = 107;
UPDATE funcionario
SET turno = 'Noite'
WHERE id_funcionario = 108;
UPDATE funcionario
SET cargo = 'Supervisor'
WHERE id_funcionario = 109;

-- DELETAR
DELETE FROM funcionario
WHERE id_funcionario = 107;
DELETE FROM funcionario
WHERE id_funcionario = 108;
DELETE FROM funcionario
WHERE id_funcionario = 109;


-- LOCALIZAÇÃO
-- INSERIR
INSERT INTO localizacao (rua,prateleira,nivel,numeracao)
VALUES('25','4','8','48');
INSERT INTO localizacao (rua,prateleira,nivel,numeracao) 
VALUES('30','2','14','98');
INSERT INTO localizacao (rua,prateleira,nivel,numeracao) 
VALUES('14','8','3','07');

-- SELECIONAR
SELECT rua, prateleira FROM localizacao ORDER BY numeracao ASC;
SELECT * FROM localizacao;
SELECT rua, nivel FROM localizacao WHERE numeracao = '07';

-- ATUALIZAR
UPDATE localizacao 
SET rua = '42'
WHERE id_localização = 10;
UPDATE localizacao
SET prateleira = '9'
WHERE id_localização = 11;
UPDATE localizacao 
SET nivel = '30'
WHERE id_localização = 12;

-- DELETAR
DELETE FROM localizacao
WHERE id_localização = 10;
DELETE FROM localizacao
WHERE id_localização = 11;
DELETE FROM localizacao
WHERE id_localização = 12;



-- TRANSPORTADORA
INSERT INTO transportadora (nome, CNPJ)
VALUES ('transporte 1', '12345678910134');
INSERT INTO transportadora (nome, CNPJ)
VALUES ('transporte 2', '13345678910134');
INSERT INTO transportadora (nome, CNPJ)
VALUES ('transporte 3', '92345678910134');

-- SELECIONAR
SELECT nome FROM transportadora order by  CNPJ asc;
SELECT * FROM transportadora;
SELECT nome FROM transportadora where CNPJ = '30';

-- ATUALIZAR
UPDATE transportadora 
SET nome = 'sedex'
WHERE id_transportadora = 7;
UPDATE transportadora 
SET nome = 'shoope'
WHERE id_transportadora = 8;
UPDATE transportadora 
SET CNPJ = '12345678912345'
WHERE id_transportadora = 9;

-- DELETAR
DELETE FROM transportadora
WHERE id_transportadora = 7;
DELETE FROM transportadora
WHERE id_transportadora = 8;
DELETE FROM transportadora
WHERE id_transportadora = 9;



-- SENSOR
-- ENCONTRAR FOREGIN KEYS
SELECT * FROM localizacao;

-- INSERIR
INSERT INTO sensor (tipo, descricao, localização_id_localização)
VALUES ('ultrassonico', 'novo', 10);
INSERT INTO sensor (tipo, descricao,localização_id_localização) 
VALUES ('luz','usado', 11);
INSERT INTO sensor (tipo, descricao,localização_id_localização)
VALUES ('toque','semi-novo', 12);

-- SELECIONAR
SELECT tipo FROM sensor ORDER BY localização_id_localização DESC;
SELECT * FROM sensor;
SELECT tipo FROM sensor WHERE descricao = 'semi-novo';

-- ATUALIZAR
UPDATE sensor 
SET tipo = 'infravermelho'
WHERE id_sensor = 5;
UPDATE sensor
SET descricao = 'novo'
WHERE id_sensor = '6';
UPDATE sensor
SET tipo = 'ultrassonico'
WHERE id_sensor = '7';

-- DELETAR
DELETE FROM sensor
WHERE id_sensor = 5;
DELETE FROM sensor
WHERE localização_id_localização = 11;
DELETE FROM sensor
WHERE localização_id_localização = 12;



-- PRODUTO
-- ENCONTRAR FOREIGN KEYS
SELECT * FROM localizacao;

-- INSERIR 
INSERT INTO produto (nome_produto, categoria, preco, localização_id_localização)
VALUES ('Notebook ','eletro', 3500.00, 10);
INSERT INTO produto (nome_produto, categoria, preco, localização_id_localização)
VALUES ('Cadeira ','Móveis', 899.90, 11);
INSERT INTO produto (nome_produto, categoria, preco, localização_id_localização)
VALUES ('telefone ','eletro', 499.99, 12);

-- SELECIONAR
SELECT * FROM produto;
SELECT * FROM produto WHERE categoria = 'eletro';
SELECT * FROM produto WHERE preco > 1000;

-- ATUALIZAR
UPDATE produto
SET preco = 3200.00
WHERE id_produto = 106;
UPDATE produto
SET categoria = 'Cadeiras'
WHERE id_produto = 107;
UPDATE produto
SET nome_produto = 'geladeira'
WHERE id_produto = 108;

-- DELETAR
DELETE FROM produto
WHERE id_produto = 106;
DELETE FROM produto
WHERE localização_id_localização = 11;
DELETE FROM produto
WHERE id_produto = 108;



-- ITEM ENTRADA
-- ENCONTRAR FOREIGN KEYS
SELECT * FROM produto;

-- INSERIR
INSERT INTO itemEntrada (data_entrada, qtd, produto_id_produto)
VALUES ('2025-01-10', 50, 106);
INSERT INTO itemEntrada (data_entrada, qtd, produto_id_produto)
VALUES ('2025-01-15', 20, 107);
INSERT INTO itemEntrada (data_entrada, qtd, produto_id_produto)
VALUES('2025-01-20', 35, 108);

-- SELECIONAR
SELECT * FROM itemEntrada;
SELECT * FROM itemEntrada WHERE qtd > '20';
SELECT * FROM itemEntrada WHERE data_entrada = '2025-01-15';

-- ATUALIZAR
UPDATE itemEntrada
SET data_entrada = '2025-02-01'
WHERE id_itemEntrada = 11;
UPDATE itemEntrada
SET qtd = 30
WHERE id_itemEntrada = 12;
UPDATE itemEntrada
SET data_entrada = '2025-03-29'
WHERE id_itemEntrada = 13;

-- DELETAR
DELETE FROM itementrada
WHERE id_itementrada = 11;
DELETE FROM itementrada
WHERE produto_id_produto = 106;
DELETE FROM itementrada
WHERE produto_id_produto = 107;

-- PEDIDO_SAIDA
-- ENCONTRAR FOREIGN KEYS
SELECT * FROM transportadora;
SELECT * FROM funcionario;
SELECT * FROM cliente;

-- INSERIR
INSERT INTO pedido_saida ( data, status, transportadora_id_transportadora, funcionario_id_funcionario, cliente_id_cliente)
VALUES ('2025-10-02', 'entregue', 7 , 107 , 4 );
INSERT INTO pedido_saida ( data, status, transportadora_id_transportadora, funcionario_id_funcionario, cliente_id_cliente)
VALUES ('2025-06-20', 'cancelada', 8 , 108 , 5 );
INSERT INTO pedido_saida ( data, status, transportadora_id_transportadora, funcionario_id_funcionario, cliente_id_cliente)
VALUES ('2025-12-01', 'a caminho', 9 , 109 , 6 );

-- SELECIONAR
SELECT id_pedido_saida FROM pedido_saida order by data asc;
SELECT * FROM pedido_saida;
SELECT data FROM pedido_saida where status = 'cancelada';

-- ATUALIZAR
UPDATE pedido_saida
SET data = '2025-09-29'
WHERE id_pedido_saida = 6;
UPDATE pedido_saida
SET status = 'a caminho'
WHERE id_pedido_saida = 7 ;
UPDATE pedido_saida
SET status = 'cancelada'
WHERE id_pedido_saida = 8 ;

-- DELETE
DELETE FROM pedido_saida
WHERE id_pedido_saida = 6;
DELETE FROM pedido_saida
WHERE transportadora_id_transportadora = 8;
DELETE FROM pedido_saida
WHERE funcionario_id_funcionario = 109;



-- ITEM SAIDA
-- ENCONTRAR FOREIGN KEYS
SELECT * FROM produto;
SELECT * FROM pedido_saida;

-- INSERIR
INSERT INTO itemsaida (data_itemsaida, qtd, produto_id_produto, pedido_saida_id_pedido_saida)
VALUES ('2025-10-11','4', '106', '6');
INSERT INTO itemsaida (data_itemsaida, qtd, produto_id_produto, pedido_saida_id_pedido_saida)
VALUES ('2025-04-28','12', '107', '7');
INSERT INTO itemsaida (data_itemsaida, qtd, produto_id_produto, pedido_saida_id_pedido_saida)
VALUES ('2025-05-29','8', '108', '8');

-- SELECIONAR
SELECT * FROM itemsaida;
SELECT * FROM itemsaida WHERE qtd > '8';
SELECT * FROM itemsaida WHERE data_itemsaida = '2025-10-11';

-- ATUALIZAR
UPDATE itemsaida
SET qtd = '18'
WHERE id_itemsaida = 4;
UPDATE itemsaida
SET data_itemsaida = '2025-06-04'
WHERE id_itemsaida = 5;
UPDATE itemsaida
SET qtd = '50'
WHERE id_itemsaida = 6;

-- DELETAR
DELETE FROM itemsaida
WHERE id_itemsaida = 4;
DELETE FROM itemsaida
WHERE produto_id_produto = 107;
DELETE FROM itemsaida
WHERE pedido_saida_id_pedido_saida = 8;




-- PEDIDO ENTRADA
-- ENCONTAR FOREIGN KEYS
SELECT * FROM fornecedor;
SELECT * FROM transportadora;
SELECT * FROM funcionario;
SELECT * FROM itementrada;

-- INSERIR
INSERT INTO pedido_entrada (data,status,fornecedor_id_fornecedor,transportadora_id_transportadora,funcionario_id_funcionario,itemEntrada_id_temEntrada)
VALUES ('2025-12-10','pendente', 6 , 7 , 107 , 11 );
INSERT INTO pedido_entrada (data,status,fornecedor_id_fornecedor,transportadora_id_transportadora,funcionario_id_funcionario,itemEntrada_id_temEntrada)
VALUES ('2025-10-15','em andamento', 7 , 8 , 108 , 12 );
INSERT INTO pedido_entrada (data,status,fornecedor_id_fornecedor,transportadora_id_transportadora,funcionario_id_funcionario,itemEntrada_id_temEntrada)
VALUES ('2025-08-20','feita', 8 , 9 , 109 , 13);

-- SELECIONAR
SELECT * FROM pedido_entrada;
SELECT * FROM pedido_entrada WHERE status = 'pendente';
SELECT * FROM pedido_entrada WHERE id_pedido_entrada = 2;

-- ATUALIZAR
UPDATE pedido_entrada
SET status = 'aprovado'
WHERE id_pedido_entrada = 4;
UPDATE pedido_entrada
SET data = '2025-07-29'
WHERE id_pedido_entrada = 5;
UPDATE pedido_entrada 
SET status = 'cancelada'
WHERE id_pedido_entrada = 6;

-- DELETAR
DELETE FROM pedido_entrada
WHERE id_pedido_entrada = 5;
DELETE FROM pedido_entrada 
WHERE fornecedor_id_fornecedor = 6;
DELETE FROM pedido_entrada
WHERE  transportadora_id_transportadora = 9 ;
