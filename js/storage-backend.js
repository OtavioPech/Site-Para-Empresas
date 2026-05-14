/**
 * ============================================================================
 * ARQUIVO: storage-backend.js (EXEMPLO)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este arquivo é um EXEMPLO de como adaptar o sistema para usar
 * um banco de dados (backend) em vez de localStorage.
 * 
 * COMO USAR:
 * Quando você tiver um servidor pronto, mude a configuração
 * em config.js para usar este arquivo.
 * 
 * ARQUITETURA:
 * Navegador (Frontend) ←→ Servidor (Backend) ←→ Banco de Dados
 * 
 * O SERVIDOR DEVE IMPLEMENTAR ENDPOINTS COMO:
 * - GET /api/products - Listar produtos
 * - POST /api/products - Criar produto
 * - PUT /api/products/:id - Editar produto
 * - DELETE /api/products/:id - Deletar produto
 * - GET /api/categories - Listar categorias
 * - POST /api/categories - Criar categoria
 * - DELETE /api/categories/:id - Deletar categoria
 * 
 * ============================================================================
 */

// Este objeto simula como seria usar um backend ao invés de localStorage
const StorageBackend = {
  
  // URL base do seu servidor
  apiUrl: CONFIG.STORAGE.API_URL || 'http://localhost:3000/api',
  
  // Token de autenticação (obtido após login)
  authToken: localStorage.getItem('auth_token') || null,
  
  /**
   * MÉTODO: setAuthToken()
   * 
   * O QUE FAZ:
   * Define o token de autenticação após o login
   * 
   * PARÂMETROS:
   * - token: token JWT ou sessão
   */
  setAuthToken: function(token) {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  },
  
  /**
   * MÉTODO: fazerRequisicao()
   * 
   * O QUE FAZ:
   * Faz uma requisição HTTP para o servidor
   * 
   * PARÂMETROS:
   * - metodo: GET, POST, PUT, DELETE
   * - endpoint: /products, /categories, etc
   * - dados: objeto com dados a enviar (para POST/PUT)
   * 
   * RETORNA:
   * Promise com resposta do servidor
   */
  fazerRequisicao: function(metodo, endpoint, dados = null) {
    const opcoes = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Se tem token de autenticação, adiciona ao header
    if (this.authToken) {
      opcoes.headers['Authorization'] = 'Bearer ' + this.authToken;
    }
    
    // Se tem dados, adiciona ao corpo da requisição
    if (dados) {
      opcoes.body = JSON.stringify(dados);
    }
    
    const url = this.apiUrl + endpoint;
    
    console.log(`📡 ${metodo} ${url}`);
    
    return fetch(url, opcoes)
      .then(resposta => {
        // Se não conseguiu conectar ao servidor
        if (!resposta.ok) {
          throw new Error(`Erro do servidor: ${resposta.status} ${resposta.statusText}`);
        }
        return resposta.json();
      })
      .catch(erro => {
        console.error('❌ Erro na requisição:', erro);
        mostrarMensagem('Erro ao conectar com o servidor', 'erro');
        throw erro;
      });
  },
  
  // ===================================================================
  // MÉTODOS PARA PRODUTOS (EXEMPLO)
  // ===================================================================
  
  /**
   * MÉTODO: carregarProdutos()
   * 
   * O QUE FAZ:
   * Carrega todos os produtos do servidor
   * 
   * RETORNA:
   * Promise que resolve com array de produtos
   * 
   * IMPLEMENTAÇÃO NO SERVIDOR (Node.js + Express):
   * app.get('/api/products', (req, res) => {
   *   // Conecta ao banco de dados
   *   const produtos = db.query('SELECT * FROM produtos');
   *   res.json(produtos);
   * });
   */
  carregarProdutos: function() {
    return this.fazerRequisicao('GET', '/products')
      .then(dados => dados.products || [])
      .catch(() => {
        console.warn('Usando localStorage como fallback');
        return Storage.getAllProducts();
      });
  },
  
  /**
   * MÉTODO: criarProduto()
   * 
   * O QUE FAZ:
   * Cria um novo produto no servidor
   * 
   * IMPLEMENTAÇÃO NO SERVIDOR:
   * app.post('/api/products', (req, res) => {
   *   const { nome, preco, categoria, ... } = req.body;
   *   const id = db.query(
   *     'INSERT INTO produtos (nome, preco, categoria, ...) VALUES (?, ?, ?, ...)',
   *     [nome, preco, categoria, ...]
   *   );
   *   res.json({ id, nome, preco, ... });
   * });
   */
  criarProduto: function(produto) {
    return this.fazerRequisicao('POST', '/products', produto)
      .then(resposta => {
        mostrarMensagem(`Produto "${resposta.nome}" criado com sucesso!`, 'sucesso');
        return resposta;
      });
  },
  
  /**
   * MÉTODO: editarProduto()
   * 
   * O QUE FAZ:
   * Edita um produto no servidor
   * 
   * IMPLEMENTAÇÃO NO SERVIDOR:
   * app.put('/api/products/:id', (req, res) => {
   *   const { id } = req.params;
   *   const { nome, preco, ... } = req.body;
   *   db.query('UPDATE produtos SET nome=?, preco=?, ... WHERE id=?');
   *   res.json({ id, nome, preco, ... });
   * });
   */
  editarProduto: function(id, dados) {
    return this.fazerRequisicao('PUT', `/products/${id}`, dados);
  },
  
  /**
   * MÉTODO: deletarProduto()
   * 
   * O QUE FAZ:
   * Deleta um produto do servidor
   * 
   * IMPLEMENTAÇÃO NO SERVIDOR:
   * app.delete('/api/products/:id', (req, res) => {
   *   const { id } = req.params;
   *   db.query('DELETE FROM produtos WHERE id=?', [id]);
   *   res.json({ sucesso: true });
   * });
   */
  deletarProduto: function(id) {
    return this.fazerRequisicao('DELETE', `/products/${id}`);
  },
  
  // ===================================================================
  // MÉTODOS PARA CATEGORIAS (MESMO PADRÃO)
  // ===================================================================
  
  carregarCategorias: function() {
    return this.fazerRequisicao('GET', '/categories')
      .then(dados => dados.categories || [])
      .catch(() => Storage.getAllCategories());
  },
  
  criarCategoria: function(categoria) {
    return this.fazerRequisicao('POST', '/categories', categoria);
  },
  
  deletarCategoria: function(id) {
    return this.fazerRequisicao('DELETE', `/categories/${id}`);
  },
};

// ===================================================================
// EXEMPLO DE COMO IMPLEMENTAR NO SERVIDOR (Node.js + Express + MySQL)
// ===================================================================

/**
 * 
 * // server.js
 * 
 * const express = require('express');
 * const mysql = require('mysql2/promise');
 * const cors = require('cors');
 * const jwt = require('jsonwebtoken');
 * 
 * const app = express();
 * 
 * // Middleware
 * app.use(cors());
 * app.use(express.json());
 * 
 * // Conexão com MySQL
 * const pool = mysql.createPool({
 *   host: 'localhost',
 *   user: 'root',
 *   password: 'sua_senha',
 *   database: 'site_produtos',
 *   waitForConnections: true,
 *   connectionLimit: 10,
 *   queueLimit: 0
 * });
 * 
 * // Middleware de autenticação
 * function verificarToken(req, res, next) {
 *   const token = req.headers.authorization?.split(' ')[1];
 *   if (!token) return res.status(401).json({ erro: 'Sem token' });
 *   
 *   try {
 *     const payload = jwt.verify(token, 'sua_chave_secreta');
 *     req.usuario = payload;
 *     next();
 *   } catch (erro) {
 *     return res.status(401).json({ erro: 'Token inválido' });
 *   }
 * }
 * 
 * // ====== PRODUTOS ======
 * 
 * // Listar todos
 * app.get('/api/products', async (req, res) => {
 *   try {
 *     const conn = await pool.getConnection();
 *     const [rows] = await conn.query('SELECT * FROM produtos');
 *     conn.release();
 *     res.json({ products: rows });
 *   } catch (erro) {
 *     res.status(500).json({ erro: erro.message });
 *   }
 * });
 * 
 * // Obter um produto
 * app.get('/api/products/:id', async (req, res) => {
 *   try {
 *     const conn = await pool.getConnection();
 *     const [rows] = await conn.query('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
 *     conn.release();
 *     res.json(rows[0] || {});
 *   } catch (erro) {
 *     res.status(500).json({ erro: erro.message });
 *   }
 * });
 * 
 * // Criar novo produto
 * app.post('/api/products', verificarToken, async (req, res) => {
 *   try {
 *     const { nome, descricao, preco, categoria, desconto } = req.body;
 *     
 *     // Validação
 *     if (!nome || !preco) {
 *       return res.status(400).json({ erro: 'Nome e preço obrigatórios' });
 *     }
 *     
 *     const conn = await pool.getConnection();
 *     const [resultado] = await conn.query(
 *       'INSERT INTO produtos (nome, descricao, preco, categoria, desconto, visivel) VALUES (?, ?, ?, ?, ?, true)',
 *       [nome, descricao, preco, categoria, desconto || 0]
 *     );
 *     conn.release();
 *     
 *     res.json({
 *       id: resultado.insertId,
 *       nome,
 *       descricao,
 *       preco,
 *       categoria,
 *       desconto
 *     });
 *   } catch (erro) {
 *     res.status(500).json({ erro: erro.message });
 *   }
 * });
 * 
 * // Editar produto
 * app.put('/api/products/:id', verificarToken, async (req, res) => {
 *   try {
 *     const { nome, descricao, preco, categoria, desconto } = req.body;
 *     
 *     const conn = await pool.getConnection();
 *     await conn.query(
 *       'UPDATE produtos SET nome=?, descricao=?, preco=?, categoria=?, desconto=? WHERE id=?',
 *       [nome, descricao, preco, categoria, desconto, req.params.id]
 *     );
 *     conn.release();
 *     
 *     res.json({ sucesso: true });
 *   } catch (erro) {
 *     res.status(500).json({ erro: erro.message });
 *   }
 * });
 * 
 * // Deletar produto
 * app.delete('/api/products/:id', verificarToken, async (req, res) => {
 *   try {
 *     const conn = await pool.getConnection();
 *     await conn.query('DELETE FROM produtos WHERE id=?', [req.params.id]);
 *     conn.release();
 *     
 *     res.json({ sucesso: true });
 *   } catch (erro) {
 *     res.status(500).json({ erro: erro.message });
 *   }
 * });
 * 
 * // Login
 * app.post('/api/login', (req, res) => {
 *   const { senha } = req.body;
 *   if (senha !== 'admin123') {
 *     return res.status(401).json({ erro: 'Senha incorreta' });
 *   }
 *   
 *   const token = jwt.sign({ usuario: 'admin' }, 'sua_chave_secreta', { expiresIn: '24h' });
 *   res.json({ token });
 * });
 * 
 * // Iniciar servidor
 * app.listen(3000, () => {
 *   console.log('Servidor rodando em http://localhost:3000');
 * });
 * 
 */

// ===================================================================
// ESTRUTURA DO BANCO DE DADOS (MySQL)
// ===================================================================

/**
 * 
 * CREATE TABLE produtos (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   nome VARCHAR(255) NOT NULL,
 *   descricao TEXT,
 *   preco DECIMAL(10, 2) NOT NULL,
 *   categoria VARCHAR(100),
 *   imagem VARCHAR(255),
 *   video VARCHAR(255),
 *   desconto INT DEFAULT 0,
 *   foraEstoque BOOLEAN DEFAULT false,
 *   visivel BOOLEAN DEFAULT true,
 *   dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   INDEX (categoria),
 *   INDEX (visivel)
 * );
 * 
 * CREATE TABLE categorias (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL UNIQUE,
 *   color VARCHAR(7) DEFAULT '#007BFF',
 *   dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 */

console.log('✓ Storage Backend (exemplo) carregado');
