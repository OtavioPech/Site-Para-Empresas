/**
 * ============================================================================
 * ARQUIVO: products.js
 * ============================================================================
 * 
 * PROPÓSITO:
 * Funções específicas para gerenciamento de produtos.
 * Separado em um arquivo à parte para manter o código mais organizado.
 * 
 * NOTA:
 * Este arquivo não é usado por padrão no projeto inicial,
 * mas está disponível para quando o projeto crescer e precisar
 * de mais funções específicas para produtos.
 * 
 * ============================================================================
 */

/**
 * CLASSE: ProdutoManager
 * 
 * Centraliza todas as operações relacionadas a produtos
 * Facilita manutenção e expansão futura
 */
class ProdutoManager {
  
  /**
   * MÉTODO: constructor()
   * 
   * Inicializa o gerenciador
   */
  constructor() {
    this.produtos = [];
    this.carregarProdutos();
  }
  
  /**
   * MÉTODO: carregarProdutos()
   * 
   * O QUE FAZ:
   * Carrega todos os produtos do armazenamento
   */
  carregarProdutos() {
    this.produtos = Storage.getAllProducts();
  }
  
  /**
   * MÉTODO: buscar()
   * 
   * O QUE FAZ:
   * Busca produtos por termo
   * 
   * PARÂMETROS:
   * - termo: texto a buscar
   * - campos: quais campos buscar (nome, descrição, etc)
   * 
   * RETORNA:
   * Array com produtos encontrados
   */
  buscar(termo, campos = ['nome', 'descricao']) {
    const termoBusca = termo.toLowerCase();
    
    return this.produtos.filter(produto => {
      return campos.some(campo => {
        const valor = produto[campo] || '';
        return valor.toLowerCase().includes(termoBusca);
      });
    });
  }
  
  /**
   * MÉTODO: filtrarPorCategoria()
   * 
   * O QUE FAZ:
   * Filtra produtos por categoria
   * 
   * PARÂMETROS:
   * - categoriaId: ID da categoria
   * 
   * RETORNA:
   * Array com produtos da categoria
   */
  filtrarPorCategoria(categoriaId) {
    return this.produtos.filter(p => p.categoria == categoriaId);
  }
  
  /**
   * MÉTODO: filtrarPorPreco()
   * 
   * O QUE FAZ:
   * Filtra produtos por intervalo de preço
   * 
   * PARÂMETROS:
   * - minimo: preço mínimo
   * - maximo: preço máximo
   * 
   * RETORNA:
   * Array com produtos no intervalo
   */
  filtrarPorPreco(minimo, maximo) {
    return this.produtos.filter(p => p.preco >= minimo && p.preco <= maximo);
  }
  
  /**
   * MÉTODO: comDesconto()
   * 
   * O QUE FAZ:
   * Retorna apenas produtos com desconto
   * 
   * RETORNA:
   * Array com produtos em promoção
   */
  comDesconto() {
    return this.produtos.filter(p => p.desconto > 0);
  }
  
  /**
   * MÉTODO: ordenar()
   * 
   * O QUE FAZ:
   * Ordena produtos por campo
   * 
   * PARÂMETROS:
   * - campo: qual campo ordenar (preco, nome, etc)
   * - ordem: 'asc' (crescente) ou 'desc' (decrescente)
   * 
   * RETORNA:
   * Array ordenado
   */
  ordenar(campo, ordem = 'asc') {
    const ordenados = [...this.produtos];
    
    ordenados.sort((a, b) => {
      let valorA = a[campo];
      let valorB = b[campo];
      
      // Se é texto, transforma em minúsculas
      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();
      }
      
      if (ordem === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });
    
    return ordenados;
  }
  
  /**
   * MÉTODO: obterMaisCaro()
   * 
   * O QUE FAZ:
   * Retorna o produto mais caro
   */
  obterMaisCaro() {
    return this.produtos.reduce((max, p) => p.preco > max.preco ? p : max);
  }
  
  /**
   * MÉTODO: obterMaisBarato()
   * 
   * O QUE FAZ:
   * Retorna o produto mais barato
   */
  obterMaisBarato() {
    return this.produtos.reduce((min, p) => p.preco < min.preco ? p : min);
  }
  
  /**
   * MÉTODO: obterMedia()
   * 
   * O QUE FAZ:
   * Calcula o preço médio dos produtos
   */
  obterMedia() {
    const soma = this.produtos.reduce((total, p) => total + p.preco, 0);
    return this.produtos.length > 0 ? soma / this.produtos.length : 0;
  }
  
  /**
   * MÉTODO: agruparPorCategoria()
   * 
   * O QUE FAZ:
   * Agrupa produtos por categoria
   * 
   * RETORNA:
   * Objeto com categorias como chaves e produtos como valores
   */
  agruparPorCategoria() {
    const agrupados = {};
    
    this.produtos.forEach(p => {
      const categoria = p.categoria || 'Sem Categoria';
      
      if (!agrupados[categoria]) {
        agrupados[categoria] = [];
      }
      
      agrupados[categoria].push(p);
    });
    
    return agrupados;
  }
  
  /**
   * MÉTODO: calcularTotalEstoque()
   * 
   * O QUE FAZ:
   * Calcula o valor total em estoque (se tivesse quantidade)
   * 
   * Nota: Este é um exemplo de como estender
   * quando adicionarem quantidade aos produtos
   */
  calcularTotalEstoque() {
    return this.produtos.reduce((total, p) => {
      return total + (p.preco * (p.quantidade || 1));
    }, 0);
  }
  
  /**
   * MÉTODO: validar()
   * 
   * O QUE FAZ:
   * Valida um objeto de produto antes de salvar
   * 
   * PARÂMETROS:
   * - produto: objeto a validar
   * 
   * RETORNA:
   * Objeto com { valido: boolean, erros: array }
   */
  validar(produto) {
    const erros = [];
    
    // Nome obrigatório
    if (!produto.nome || produto.nome.trim() === '') {
      erros.push('Nome é obrigatório');
    }
    
    // Nome não pode ter menos de 3 caracteres
    if (produto.nome && produto.nome.length < 3) {
      erros.push('Nome deve ter pelo menos 3 caracteres');
    }
    
    // Preço obrigatório
    if (produto.preco === undefined || produto.preco === null) {
      erros.push('Preço é obrigatório');
    }
    
    // Preço deve ser positivo
    if (produto.preco < 0) {
      erros.push('Preço não pode ser negativo');
    }
    
    // Desconto entre 0 e 100
    if (produto.desconto !== undefined && (produto.desconto < 0 || produto.desconto > 100)) {
      erros.push('Desconto deve estar entre 0 e 100');
    }
    
    return {
      valido: erros.length === 0,
      erros: erros
    };
  }
  
  /**
   * MÉTODO: exportarCSV()
   * 
   * O QUE FAZ:
   * Exporta produtos em formato CSV para Excel
   * 
   * RETORNA:
   * String com dados em formato CSV
   */
  exportarCSV() {
    let csv = 'Nome,Preço,Categoria,Desconto,Status\n';
    
    this.produtos.forEach(p => {
      const status = p.foraEstoque ? 'Fora de Estoque' : 'Disponível';
      csv += `"${p.nome}",${p.preco},"${p.categoria}",${p.desconto}%,"${status}"\n`;
    });
    
    return csv;
  }
  
  /**
   * MÉTODO: obterEstatisticas()
   * 
   * O QUE FAZ:
   * Retorna estatísticas detalhadas dos produtos
   * 
   * RETORNA:
   * Objeto com diversos dados estatísticos
   */
  obterEstatisticas() {
    const total = this.produtos.length;
    const comDesconto = this.produtos.filter(p => p.desconto > 0).length;
    const foraEstoque = this.produtos.filter(p => p.foraEstoque).length;
    const visivel = this.produtos.filter(p => p.visivel !== false).length;
    
    const precos = this.produtos.map(p => p.preco);
    const minimo = Math.min(...precos);
    const maximo = Math.max(...precos);
    const media = precos.reduce((a, b) => a + b, 0) / precos.length;
    
    return {
      total,
      comDesconto,
      foraEstoque,
      visivel,
      minimo,
      maximo,
      media,
    };
  }
}

// Cria instância global
const produtoManager = new ProdutoManager();

console.log('✓ Products.js carregado');
