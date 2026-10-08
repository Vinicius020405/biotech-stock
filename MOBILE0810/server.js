const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); // 1. IMPORTAÇÃO DO BCRYPT ADICIONADA

const app = express();

// Configuração de Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados MySQL
const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'estoque_sensores',
  waitForConnections: true,
  connectionLimit: 10,
});

// Rota de Teste para verificar no navegador do BlueStacks
app.get('/', (req, res) => {
  res.send('Servidor do Backend funcionando e acessível!');
});

// --- AUTENTICAÇÃO ATUALIZADA ---

const handleLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário apenas pelo E-mail e inclui o campo 'senha' para comparação
    const [rows] = await db.query(
      `SELECT 
        id_usuario,
        nome,
        email,
        senha,
        perfil,
        status,
        plano,
        criado_em
      FROM usuarios
      WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    const user = rows[0];
    let senhaValida = false;

    // Se a senha for hash de bcrypt ($2b$ ou $2a$)
    if (user.senha && (user.senha.startsWith('$2b$') || user.senha.startsWith('$2a$'))) {
      senhaValida = await bcrypt.compare(senha, user.senha);
    } else {
      // Comparação direta para senhas gravadas em texto puro (ex: 123456)
      senhaValida = (senha === user.senha);
    }

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // Remove a senha do objeto antes de enviar a resposta
    delete user.senha;

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: error.message });
  }
};

// Suporta tanto /api/login quanto /login
app.post('/api/login', handleLogin);
app.post('/login', handleLogin);


// --- DASHBOARD ---

app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ totalProducts }]] = await db.query(
      'SELECT SUM(quantidade_atual) AS totalProducts FROM estoque'
    );

    const [[{ lowStockCount }]] = await db.query(`
      SELECT COUNT(*) AS lowStockCount
      FROM estoque e
      JOIN produto p
        ON e.id_produto = p.id_produto
      WHERE e.quantidade_atual <= p.estoque_minimo
    `);

    const [recentActivities] = await db.query(`
      SELECT
        item.id_item_saida AS id,
        'Saída' AS type,
        item.quantidade,
        p.nome AS product
      FROM item_pedido_saida item
      JOIN produto p
        ON item.id_produto = p.id_produto
      ORDER BY item.id_item_saida DESC
      LIMIT 5
    `);

    res.json({
      totalProducts: totalProducts || 0,
      lowStockCount: lowStockCount || 0,
      recentActivities
    });

  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});


// --- PRODUTOS ---

const handleGetProdutos = async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT
        id_produto,
        codigo,
        nome,
        descricao,
        unidade_medida,
        estoque_minimo,
        estoque_maximo,
        status,
        criado_em
      FROM produto
      ORDER BY nome ASC
    `);

    res.json(produtos);

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/produtos', handleGetProdutos);
app.get('/produtos', handleGetProdutos);


// BUSCAR PRODUTO PELO QR CODE
app.get('/api/produtos/code/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT
        p.id_produto,
        p.codigo,
        p.nome,
        p.descricao,
        p.unidade_medida,
        p.estoque_minimo,
        p.estoque_maximo,
        p.status,
        COALESCE(SUM(e.quantidade_atual), 0) AS quantidade_estoque
      FROM produto p
      LEFT JOIN estoque e
        ON p.id_produto = e.id_produto
      WHERE p.codigo = ?
         OR CAST(p.id_produto AS CHAR) = ?
      GROUP BY
        p.id_produto,
        p.codigo,
        p.nome,
        p.descricao,
        p.unidade_medida,
        p.estoque_minimo,
        p.estoque_maximo,
        p.status
    `, [code, code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Erro ao buscar produto pelo QR Code:', error);
    res.status(500).json({ error: error.message });
  }
});


// BUSCAR PRODUTO POR ID OU CÓDIGO
app.get('/api/products/:identifier', async (req, res) => {
  const { identifier } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT
        p.id_produto,
        p.codigo,
        p.nome,
        p.descricao,
        p.unidade_medida,
        p.estoque_minimo,
        p.estoque_maximo,
        p.status,
        COALESCE(SUM(e.quantidade_atual), 0) AS quantidade_estoque
      FROM produto p
      LEFT JOIN estoque e
        ON p.id_produto = e.id_produto
      WHERE p.id_produto = ?
         OR p.codigo = ?
      GROUP BY
        p.id_produto,
        p.codigo,
        p.nome,
        p.descricao,
        p.unidade_medida,
        p.estoque_minimo,
        p.estoque_maximo,
        p.status
    `, [identifier, identifier]);

    if (rows.length > 0) {
      return res.json(rows[0]);
    }

    res.status(404).json({ message: 'Produto não encontrado.' });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: error.message });
  }
});


// --- CAMINHÕES ---

const handleGetCaminhoes = async (req, res) => {
  try {
    const [caminhoes] = await db.query(`
      SELECT
        id_caminhao,
        placa,
        modelo,
        cor,
        marca,
        chassi,
        imagem_nome,
        imagem_tipo,
        imagem_blob
      FROM caminhao
      ORDER BY id_caminhao DESC
    `);

    const resultado = caminhoes.map(caminhao => ({
      id_caminhao: caminhao.id_caminhao,
      placa: caminhao.placa,
      modelo: caminhao.modelo,
      cor: caminhao.cor,
      marca: caminhao.marca,
      chassi: caminhao.chassi,
      imagem_nome: caminhao.imagem_nome,
      imagem_tipo: caminhao.imagem_tipo,
      imagem: caminhao.imagem_blob
        ? caminhao.imagem_blob.toString('base64')
        : null
    }));

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao buscar caminhões:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/caminhoes', handleGetCaminhoes);
app.get('/caminhoes', handleGetCaminhoes);


// --- ESTOQUE ---

const handleGetEstoque = async (req, res) => {
  try {
    const [estoque] = await db.query(`
      SELECT
        e.id_estoque,
        e.id_produto,
        e.id_localizacao,
        e.quantidade_atual,
        e.atualizado_em,
        p.codigo,
        p.nome AS produto_nome,
        p.unidade_medida,
        p.estoque_minimo,
        p.estoque_maximo,
        l.nome AS localizacao_nome,
        l.setor
      FROM estoque e
      INNER JOIN produto p
        ON e.id_produto = p.id_produto
      LEFT JOIN localizacao l
        ON e.id_localizacao = l.id_localizacao
      ORDER BY e.id_estoque ASC
    `);

    res.json(estoque);

  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/estoque', handleGetEstoque);
app.get('/estoque', handleGetEstoque);
app.get('/api/stock', handleGetEstoque);


// --- FORNECEDORES ---

const handleGetFornecedores = async (req, res) => {
  try {
    const [fornecedores] = await db.query(`
      SELECT
        id_fornecedor,
        nome,
        cnpj,
        email,
        telefone,
        endereco,
        cep,
        contato_responsavel,
        status,
        observacoes
      FROM fornecedor
      ORDER BY nome ASC
    `);

    res.json(fornecedores);

  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/fornecedores', handleGetFornecedores);
app.get('/fornecedores', handleGetFornecedores);


// --- LOCALIZAÇÕES ---

const handleGetLocations = async (req, res) => {
  try {
    const [locations] = await db.query(`
      SELECT
        id_localizacao,
        nome,
        setor,
        corredor,
        prateleira,
        observacao
      FROM localizacao
      ORDER BY nome ASC
    `);

    res.json(locations);

  } catch (error) {
    console.error('Erro ao buscar localizações:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/locations', handleGetLocations);
app.get('/locations', handleGetLocations);


// --- SENSORES ---

const handleGetSensores = async (req, res) => {
  try {
    const [sensores] = await db.query(`
      SELECT
        id_sensor,
        nome,
        tipo_sensor,
        codigo_sensor,
        id_localizacao,
        id_produto,
        status,
        criado_em
      FROM cadastro_sensor
      ORDER BY nome ASC
    `);

    res.json(sensores);

  } catch (error) {
    console.error('Erro ao buscar sensores:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/sensores', handleGetSensores);
app.get('/sensores', handleGetSensores);


// --- PEDIDO DE ENTRADA ---

app.get('/api/pedido-entrada', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_pedido_entrada,
        numero_documento,
        data_entrada,
        id_usuario,
        observacao,
        status,
        id_fornecedor,
        criado_em
      FROM pedido_entrada
      ORDER BY id_pedido_entrada DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos de entrada:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pedido-entrada', async (req, res) => {
  const {
    numero_documento,
    data_entrada,
    id_usuario,
    observacao,
    status,
    id_fornecedor
  } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO pedido_entrada
      (
        numero_documento,
        data_entrada,
        id_usuario,
        observacao,
        status,
        id_fornecedor
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      numero_documento,
      data_entrada,
      id_usuario,
      observacao,
      status,
      id_fornecedor
    ]);

    res.json({
      success: true,
      id_pedido_entrada: result.insertId
    });

  } catch (error) {
    console.error('Erro ao criar pedido de entrada:', error);
    res.status(500).json({ error: error.message });
  }
});


// ITEM PEDIDO DE ENTRADA
app.post('/api/item-pedido-entrada', async (req, res) => {
  const {
    id_pedido_entrada,
    id_produto,
    id_localizacao,
    quantidade,
    valor_unitario,
    valor_total
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(`
      INSERT INTO item_pedido_entrada
      (
        id_pedido_entrada,
        id_produto,
        id_localizacao,
        quantidade,
        valor_unitario,
        valor_total
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      id_pedido_entrada,
      id_produto,
      id_localizacao,
      quantidade,
      valor_unitario || 0,
      valor_total || 0
    ]);

    const [estoqueExistente] = await connection.query(`
      SELECT id_estoque
      FROM estoque
      WHERE id_produto = ?
        AND id_localizacao = ?
      LIMIT 1
    `, [
      id_produto,
      id_localizacao
    ]);

    if (estoqueExistente.length > 0) {
      await connection.query(`
        UPDATE estoque
        SET quantidade_atual = quantidade_atual + ?
        WHERE id_estoque = ?
      `, [
        quantidade,
        estoqueExistente[0].id_estoque
      ]);
    } else {
      await connection.query(`
        INSERT INTO estoque
        (
          id_produto,
          id_localizacao,
          quantidade_atual
        )
        VALUES (?, ?, ?)
      `, [
        id_produto,
        id_localizacao,
        quantidade
      ]);
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Item de entrada registrado com sucesso.'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar item de entrada:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});


// --- PEDIDO DE SAÍDA ---

app.get('/api/pedido-saida', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_pedido_saida,
        numero_documento,
        solicitante,
        data_saida,
        id_usuario,
        id_caminhao,
        status,
        criado_em
      FROM pedido_saida
      ORDER BY id_pedido_saida DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos de saída:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pedido-saida', async (req, res) => {
  const {
    numero_documento,
    solicitante,
    data_saida,
    id_usuario,
    id_caminhao,
    status,
    // Dados do produto/estoque enviados pelo app
    id_produto,
    id_localizacao,
    quantidade,
    itens
  } = req.body;

  let conn;
  try {
    // Obtém a conexão para garantir o uso de transação segura
    conn = typeof db.getConnection === 'function' ? await db.getConnection() : db;
    if (conn.beginTransaction) await conn.beginTransaction();

    // 1. Cria o registo do pedido de saída
    const [result] = await conn.query(`
      INSERT INTO pedido_saida
      (
        numero_documento,
        solicitante,
        data_saida,
        id_usuario,
        id_caminhao,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      numero_documento || null,
      solicitante || null,
      data_saida || new Date().toISOString().slice(0, 10),
      id_usuario || null,
      id_caminhao || null,
      status || 'finalizado'
    ]);

    const id_pedido_saida = result.insertId;

    // 2. Prepara os itens a processar (seja item único ou lista de itens)
    let listaItens = [];
    if (Array.isArray(itens) && itens.length > 0) {
      listaItens = itens;
    } else if (id_produto && id_localizacao && quantidade) {
      listaItens = [{ id_produto, id_localizacao, quantidade }];
    }

    // 3. Regista o item na tabela item_pedido_saida e DÁ BAIXA no Estoque
    for (const item of listaItens) {
      const qtd = Number(item.quantidade);

      // Insere o item associado ao pedido de saída
      await conn.query(`
        INSERT INTO item_pedido_saida (id_pedido_saida, id_produto, id_localizacao, quantidade)
        VALUES (?, ?, ?, ?)
      `, [id_pedido_saida, item.id_produto, item.id_localizacao, qtd]);

      // Subtrai a quantidade do estoque para esse produto e local
      await conn.query(`
        UPDATE estoque
        SET quantidade = quantidade - ?
        WHERE id_produto = ? AND id_localizacao = ?
      `, [qtd, item.id_produto, item.id_localizacao]);
    }

    if (conn.commit) await conn.commit();

    res.json({
      success: true,
      message: 'Saída registrada e estoque atualizado com sucesso!',
      id_pedido_saida: id_pedido_saida
    });

  } catch (error) {
    if (conn && conn.rollback) await conn.rollback();
    console.error('Erro ao criar pedido de saída:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn && typeof db.getConnection === 'function' && conn.release) {
      conn.release();
    }
  }
});


// ITEM PEDIDO DE SAÍDA
app.post('/api/item-pedido-saida', async (req, res) => {
  const {
    id_pedido_saida,
    id_produto,
    id_localizacao,
    quantidade
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [estoque] = await connection.query(`
      SELECT
        id_estoque,
        quantidade_atual
      FROM estoque
      WHERE id_produto = ?
        AND id_localizacao = ?
      LIMIT 1
    `, [
      id_produto,
      id_localizacao
    ]);

    if (estoque.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: 'Estoque não encontrado para esse produto e localização.'
      });
    }

    if (Number(estoque[0].quantidade_atual) < Number(quantidade)) {
      await connection.rollback();
      return res.status(400).json({
        message: 'Estoque insuficiente.'
      });
    }

    await connection.query(`
      INSERT INTO item_pedido_saida
      (
        id_pedido_saida,
        id_produto,
        id_localizacao,
        quantidade
      )
      VALUES (?, ?, ?, ?)
    `, [
      id_pedido_saida,
      id_produto,
      id_localizacao,
      quantidade
    ]);

    await connection.query(`
      UPDATE estoque
      SET quantidade_atual = quantidade_atual - ?
      WHERE id_estoque = ?
    `, [
      quantidade,
      estoque[0].id_estoque
    ]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Item de saída registrado com sucesso.'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar item de saída:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});


// --- MOVIMENTAÇÃO DE ESTOQUE ---

app.post('/api/stock/move', async (req, res) => {
  const {
    productId,
    locationId,
    type,
    quantity,
    pedidoId
  } = req.body;

  const qtyNum = parseFloat(quantity);

  if (
    !productId ||
    !locationId ||
    !type ||
    isNaN(qtyNum) ||
    qtyNum <= 0
  ) {
    return res.status(400).json({
      message: 'Dados inválidos ou incompletos.'
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    if (type === 'Entrada') {
      const [estoque] = await connection.query(`
        SELECT id_estoque
        FROM estoque
        WHERE id_produto = ?
          AND id_localizacao = ?
        LIMIT 1
      `, [productId, locationId]);

      if (estoque.length > 0) {
        await connection.query(`
          UPDATE estoque
          SET quantidade_atual = quantidade_atual + ?
          WHERE id_estoque = ?
        `, [qtyNum, estoque[0].id_estoque]);
      } else {
        await connection.query(`
          INSERT INTO estoque
          (id_produto, id_localizacao, quantidade_atual)
          VALUES (?, ?, ?)
        `, [productId, locationId, qtyNum]);
      }

      if (pedidoId) {
        await connection.query(`
          INSERT INTO item_pedido_entrada
          (id_pedido_entrada, id_produto, id_localizacao, quantidade)
          VALUES (?, ?, ?, ?)
        `, [pedidoId, productId, locationId, qtyNum]);
      }

    } else if (type === 'Saída') {
      const [result] = await connection.query(`
        UPDATE estoque
        SET quantidade_atual = quantidade_atual - ?
        WHERE id_produto = ?
          AND id_localizacao = ?
          AND quantidade_atual >= ?
      `, [qtyNum, productId, locationId, qtyNum]);

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(400).json({
          message: 'Estoque insuficiente ou registro não encontrado.'
        });
      }

      if (pedidoId) {
        await connection.query(`
          INSERT INTO item_pedido_saida
          (id_pedido_saida, id_produto, id_localizacao, quantidade)
          VALUES (?, ?, ?, ?)
        `, [pedidoId, productId, locationId, qtyNum]);
      }

    } else {
      await connection.rollback();
      return res.status(400).json({
        message: 'Tipo de movimentação inválido.'
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Movimentação realizada com sucesso!'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro na movimentação:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});


// --- HISTÓRICO (ENTRADAS E SAÍDAS) ---

const handleGetHistory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM (
        -- BUSCA SAÍDAS
        SELECT
          CONCAT('S-', item.id_item_saida) AS id,
          'Saída' AS type,
          item.quantidade,
          ps.data_saida AS date,
          ps.criado_em AS created_at, -- Inclui a data/hora exata do lançamento
          p.nome AS product,
          l.nome AS localizacao
        FROM item_pedido_saida item
        JOIN produto p
          ON item.id_produto = p.id_produto
        JOIN pedido_saida ps
          ON item.id_pedido_saida = ps.id_pedido_saida
        LEFT JOIN localizacao l
          ON item.id_localizacao = l.id_localizacao

        UNION ALL

        -- BUSCA ENTRADAS
        SELECT
          CONCAT('E-', item.id_item_entrada) AS id,
          'Entrada' AS type,
          item.quantidade,
          pe.data_entrada AS date,
          pe.criado_em AS created_at, -- Inclui a data/hora exata do lançamento
          p.nome AS product,
          l.nome AS localizacao
        FROM item_pedido_entrada item
        JOIN produto p
          ON item.id_produto = p.id_produto
        JOIN pedido_entrada pe
          ON item.id_pedido_entrada = pe.id_pedido_entrada
        LEFT JOIN localizacao l
          ON item.id_localizacao = l.id_localizacao
      ) AS historico_completo
      -- Ordena primariamente pelo carimbo de data/hora exato do cadastro
      ORDER BY created_at DESC, date DESC
    `);

    res.json(rows);

  } catch (error) {
    console.error('Erro no histórico:', error);
    res.status(500).json({ error: error.message });
  }
};

app.get('/api/history', handleGetHistory);
app.get('/history', handleGetHistory);
app.get('/api/historico', handleGetHistory);
app.get('/historico', handleGetHistory);

// 1. Buscar dados do usuário pelo ID
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nome, email, perfil, status, plano FROM usuarios WHERE id_usuario = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Alterar Senha (com suporte a bcrypt)
// Rota para alterar a senha do utilizador
app.put('/api/usuarios/:id/senha', async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ message: 'Por favor, preencha a senha atual e a nova senha.' });
  }

  try {
    // 1. Procura o utilizador na base de dados
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    const usuario = rows[0];

    // 2. Verifica se a senha atual inserida está correta
    if (usuario.senha !== senhaAtual) {
      return res.status(401).json({ message: 'A senha atual está incorreta.' });
    }

    // 3. Atualiza para a nova senha na base de dados
    await db.query('UPDATE usuarios SET senha = ? WHERE id_usuario = ?', [novaSenha, id]);

    return res.json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ message: 'Erro interno no servidor ao alterar a senha.' });
  }
});
// INICIAR SERVIDOR
const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});