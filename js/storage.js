/**
 * ============================================================================
 * ARQUIVO: storage.js
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este arquivo é uma abstração (camada intermediária) para armazenamento
 * de dados. Ele foi criado para permitir que você mude de um sistema de
 * armazenamento para outro sem precisar alterar todo o resto do código.
 * 
 * CONCEITO IMPORTANTE - ABSTRAÇÃO:
 * Imagine que você está escrevendo um livro. Em vez de escrever diretamente
 * sobre o papel, você escreve para um "assistente" que pode:
 * - Escrever no papel (localStorage)
 * - Escrever em um arquivo externo (JSON)
 * - Enviar para um servidor (Banco de dados)
 * 
 * Você não precisa saber HOW o assistente faz isso. Você só pede:
 * "Salva isto", "Pega aquilo", "Deleta isto".
 * 
 * VANTAGENS:
 * - Fácil trocar de localStorage para banco de dados
 * - O resto do código não precisa mudar
 * - Preparado para crescimento da empresa
 * - Código mais limpo e organizado
 * 
 * COMO USAR:
 * // Salvar dados
 * Storage.save('produtos', dados);
 * 
 * // Carregar dados
 * const dados = Storage.load('produtos');
 * 
 * // Deletar dados
 * Storage.delete('produtos');
 * 
 * ============================================================================
 */

// Criamos um objeto chamado Storage com todos os métodos de armazenamento
const Storage = {
  
  // =========================================================================
  // MÉTODOS PRINCIPAIS - OPERAÇÕES BÁSICAS
  // =========================================================================
  
  /**
   * FUNÇÃO: save()
   * 
   * O QUE FAZ:
   * Salva dados no armazenamento configurado (localStorage, JSON ou BD)
   * 
   * PARÂMETROS:
   * - key: chave única para identificar os dados
   * - data: os dados que você quer salvar (pode ser objeto, array, etc)
   * 
   * COMO FUNCIONA:
   * 1. Converte os dados para string (JSON)
   * 2. Salva no localStorage
   * 3. Retorna true se conseguiu, false se não
   * 
   * EXEMPLO DE USO:
   * const meuProduto = { nome: 'Produto A', preco: 100 };
   * Storage.save('meu_produto', meuProduto);
   * 
   * O QUE SERÁ SALVO NO NAVEGADOR:
   * localStorage['site_produtos_meu_produto'] = '{"nome":"Produto A","preco":100}'
   */
  save: function(key, data) {
    try {
      // Usa a função do config para gerar a chave com prefixo
      const fullKey = CONFIG.getStorageKey(key);
      
      // Converte os dados para string JSON
      // JSON.stringify transforma objetos em texto
      const jsonString = JSON.stringify(data);
      
      // Salva no localStorage
      localStorage.setItem(fullKey, jsonString);
      
      console.log(`✓ Dados salvos: ${key}`);
      return true;
    } catch (error) {
      console.error(`✗ Erro ao salvar ${key}:`, error);
      return false;
    }
  },
  
  /**
   * FUNÇÃO: load()
   * 
   * O QUE FAZ:
   * Carrega dados que foram salvos anteriormente
   * 
   * PARÂMETROS:
   * - key: chave dos dados que quer carregar
   * - defaultValue: o que retornar se a chave não existir (opcional)
   * 
   * RETORNA:
   * Os dados salvos, ou o valor padrão se não existir
   * 
   * EXEMPLO DE USO:
   * const meuProduto = Storage.load('meu_produto');
   * // Retorna: { nome: 'Produto A', preco: 100 }
   * 
   * // Com valor padrão
   * const produtos = Storage.load('produtos', []);
   * // Se não existir, retorna array vazio []
   */
  load: function(key, defaultValue = null) {
    try {
      // Usa a função do config para gerar a chave com prefixo
      const fullKey = CONFIG.getStorageKey(key);
      
      // Tenta pegar do localStorage
      const jsonString = localStorage.getItem(fullKey);
      
      // Se não encontrou, retorna o valor padrão
      if (jsonString === null) {
        return defaultValue;
      }
      
      // Se encontrou, converte de volta para objeto
      // JSON.parse transforma texto em objeto JavaScript
      const data = JSON.parse(jsonString);
      
      console.log(`✓ Dados carregados: ${key}`);
      return data;
    } catch (error) {
      console.error(`✗ Erro ao carregar ${key}:`, error);
      return defaultValue;
    }
  },
  
  /**
   * FUNÇÃO: delete()
   * 
   * O QUE FAZ:
   * Remove dados salvos do armazenamento
   * 
   * PARÂMETROS:
   * - key: chave dos dados que quer deletar
   * 
   * RETORNA:
   * true se conseguiu deletar, false se não
   * 
   * EXEMPLO DE USO:
   * Storage.delete('meu_produto');
   * // Remove do localStorage
   */
  delete: function(key) {
    try {
      // Usa a função do config para gerar a chave com prefixo
      const fullKey = CONFIG.getStorageKey(key);
      
      // Remove do localStorage
      localStorage.removeItem(fullKey);
      
      console.log(`✓ Dados deletados: ${key}`);
      return true;
    } catch (error) {
      console.error(`✗ Erro ao deletar ${key}:`, error);
      return false;
    }
  },
  
  /**
   * FUNÇÃO: exists()
   * 
   * O QUE FAZ:
   * Verifica se uma chave de dados existe no armazenamento
   * 
   * PARÂMETROS:
   * - key: chave que quer verificar
   * 
   * RETORNA:
   * true se existe, false se não existe
   * 
   * EXEMPLO DE USO:
   * if (Storage.exists('meu_produto')) {
   *   console.log('Os dados já estão salvos');
   * } else {
   *   console.log('Precisa salvar os dados');
   * }
   */
  exists: function(key) {
    const fullKey = CONFIG.getStorageKey(key);
    return localStorage.getItem(fullKey) !== null;
  },
  
  // =========================================================================
  // MÉTODOS ESPECIALIZADOS - PARA PRODUTOS
  // =========================================================================
  
  /**
   * FUNÇÃO: saveProduct()
   * 
   * O QUE FAZ:
   * Salva um produto individual no armazenamento
   * Automaticamente gera um ID único se não tiver
   * 
   * PARÂMETROS:
   * - product: objeto com dados do produto
   * 
   * RETORNA:
   * O produto salvo (com ID gerado se necessário)
   * 
   * EXEMPLO DE USO:
   * const novo = Storage.saveProduct({
   *   name: 'Produto A',
   *   price: 100,
   *   category: 'Eletrônicos'
   * });
   * // Retorna o produto com ID adicionado
   */
  saveProduct: function(product) {
    // Gera um ID único se o produto não tiver
    if (!product.id) {
      product.id = this.generateId();
    }
    
    // Carrega todos os produtos existentes
    let products = this.load('products', []);
    
    // Verifica se este produto já existe
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      // Se existe, atualiza
      products[existingIndex] = product;
      console.log(`✓ Produto atualizado: ${product.name}`);
    } else {
      // Se não existe, adiciona como novo
      products.push(product);
      console.log(`✓ Novo produto adicionado: ${product.name}`);
    }
    
    // Salva todos os produtos de volta
    this.save('products', products);
    
    return product;
  },
  
  /**
   * FUNÇÃO: getProduct()
   * 
   * O QUE FAZ:
   * Pega um produto específico pelo ID
   * 
   * PARÂMETROS:
   * - id: ID do produto que quer carregar
   * 
   * RETORNA:
   * O objeto do produto, ou null se não encontrar
   * 
   * EXEMPLO DE USO:
   * const produto = Storage.getProduct(1);
   * console.log(produto.name);
   */
  getProduct: function(id) {
    const products = this.load('products', []);
    return products.find(p => p.id === id) || null;
  },
  
  /**
   * FUNÇÃO: getAllProducts()
   * 
   * O QUE FAZ:
   * Carrega TODOS os produtos salvos
   * 
   * RETORNA:
   * Array com todos os produtos
   * 
   * EXEMPLO DE USO:
   * const todos = Storage.getAllProducts();
   * console.log(`Total de produtos: ${todos.length}`);
   */
  getAllProducts: function() {
    return this.load('products', []);
  },
  
  /**
   * FUNÇÃO: deleteProduct()
   * 
   * O QUE FAZ:
   * Remove um produto pelo ID
   * 
   * PARÂMETROS:
   * - id: ID do produto que quer deletar
   * 
   * RETORNA:
   * true se conseguiu deletar, false se não
   * 
   * EXEMPLO DE USO:
   * Storage.deleteProduct(1);
   * // Remove o produto com ID 1
   */
  deleteProduct: function(id) {
    let products = this.load('products', []);
    
    // Filtra removendo o produto com este ID
    // filter retorna apenas os produtos que NÃO têm este ID
    const originalLength = products.length;
    products = products.filter(p => p.id !== id);
    
    // Verifica se realmente deletou algo
    if (products.length < originalLength) {
      this.save('products', products);
      console.log(`✓ Produto deletado: ID ${id}`);
      return true;
    } else {
      console.log(`✗ Produto não encontrado: ID ${id}`);
      return false;
    }
  },
  
  // =========================================================================
  // MÉTODOS ESPECIALIZADOS - PARA CATEGORIAS
  // =========================================================================
  
  /**
   * FUNÇÃO: saveCategory()
   * 
   * O QUE FAZ:
   * Salva uma categoria no armazenamento
   * 
   * PARÂMETROS:
   * - category: objeto com dados da categoria
   * 
   * EXEMPLO DE USO:
   * Storage.saveCategory({
   *   id: 1,
   *   name: 'Eletrônicos',
   *   color: '#007BFF'
   * });
   */
  saveCategory: function(category) {
    if (!category.id) {
      category.id = this.generateId();
    }
    
    let categories = this.load('categories', []);
    const existingIndex = categories.findIndex(c => c.id === category.id);
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    this.save('categories', categories);
    return category;
  },
  
  /**
   * FUNÇÃO: getAllCategories()
   * 
   * O QUE FAZ:
   * Carrega todas as categorias criadas
   * 
   * RETORNA:
   * Array com todas as categorias
   */
  getAllCategories: function() {
    return this.load('categories', []);
  },
  
  /**
   * FUNÇÃO: deleteCategory()
   * 
   * O QUE FAZ:
   * Remove uma categoria
   * 
   * PARÂMETROS:
   * - id: ID da categoria que quer deletar
   */
  deleteCategory: function(id) {
    let categories = this.load('categories', []);
    const originalLength = categories.length;
    categories = categories.filter(c => c.id !== id);
    
    if (categories.length < originalLength) {
      this.save('categories', categories);
      return true;
    }
    return false;
  },
  
  // =========================================================================
  // MÉTODOS AUXILIARES
  // =========================================================================
  
  /**
   * FUNÇÃO: generateId()
   * 
   * O QUE FAZ:
   * Gera um ID único baseado no timestamp (data/hora)
   * Cada chamada retorna um número diferente
   * 
   * RETORNA:
   * Um número único
   * 
   * EXEMPLO DE USO:
   * const id1 = Storage.generateId(); // 1726234567890
   * const id2 = Storage.generateId(); // 1726234567891
   * // Sempre diferentes!
   */
  generateId: function() {
    // Date.now() retorna o número de milissegundos desde 1970
    // É único para cada momento
    return Date.now();
  },
  
  /**
   * FUNÇÃO: clearAll()
   * 
   * O QUE FAZ:
   * DELETA TODOS OS DADOS salvos pelo site
   * Use com cuidado!
   * 
   * AVISO:
   * Isto vai apagar:
   * - Todos os produtos
   * - Todas as categorias
   * - Todas as configurações salvas
   * 
   * EXEMPLO DE USO:
   * if (confirm('Tem certeza que quer deletar TUDO?')) {
   *   Storage.clearAll();
   * }
   */
  clearAll: function() {
    if (confirm('⚠️ Isto vai DELETAR todos os dados salvos!\n\nTem certeza?')) {
      const prefix = CONFIG.STORAGE.PREFIX;
      const keys = Object.keys(localStorage);
      
      // Percorre todas as chaves do localStorage
      for (let key of keys) {
        // Se começa com o prefixo do nosso site, deleta
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      }
      
      console.log('✓ Todos os dados foram apagados');
      return true;
    }
    return false;
  },
  
  /**
   * FUNÇÃO: exportData()
   * 
   * O QUE FAZ:
   * Exporta todos os dados para um arquivo JSON
   * Útil para backup ou migração para outro servidor
   * 
   * RETORNA:
   * String JSON com todos os dados
   * 
   * EXEMPLO DE USO:
   * const dados = Storage.exportData();
   * console.log(dados);
   * // Pode salvar isto em um arquivo
   */
  exportData: function() {
    const products = this.getAllProducts();
    const categories = this.getAllCategories();
    
    const data = {
      exportDate: new Date().toLocaleString('pt-BR'),
      version: '1.0',
      products: products,
      categories: categories,
    };
    
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * FUNÇÃO: importData()
   * 
   * O QUE FAZ:
   * Importa dados de um arquivo JSON (feito com exportData)
   * 
   * PARÂMETROS:
   * - jsonString: string JSON com os dados
   * 
   * RETORNA:
   * true se conseguiu importar, false se houve erro
   * 
   * EXEMPLO DE USO:
   * const dados = '{"products":[...], "categories":[...]}';
   * Storage.importData(dados);
   */
  importData: function(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.products) {
        this.save('products', data.products);
      }
      
      if (data.categories) {
        this.save('categories', data.categories);
      }
      
      console.log('✓ Dados importados com sucesso');
      return true;
    } catch (error) {
      console.error('✗ Erro ao importar dados:', error);
      return false;
    }
  },
};

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
