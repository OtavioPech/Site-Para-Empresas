class AdminPanel {
  constructor() {
    this.logado = false;
    this.token = null;
    this.tempoLogin = null;
    this.verificarSessaoAnterior();
  }

  verificarSessaoAnterior() {
    const tokenSalvo = localStorage.getItem('admin_token');
    const tempoSalvo = localStorage.getItem('admin_tempo');
    if (!tokenSalvo || !tempoSalvo) return;

    const agora = Date.now();
    const tempoDecorrido = (agora - parseInt(tempoSalvo, 10)) / 1000 / 60;
    if (tempoDecorrido < CONFIG.ADMIN.SESSION_TIMEOUT) {
      this.logado = true;
      this.token = tokenSalvo;
      this.tempoLogin = Number(tempoSalvo);
    } else {
      this.logout();
    }
  }

  login(senha, chave = '') {
    if (senha !== CONFIG.ADMIN.PASSWORD) {
      mostrarMensagem('Senha incorreta!', 'erro');
      return false;
    }
    if (chave && chave !== CONFIG.ADMIN.SECURITY_KEY) {
      mostrarMensagem('Chave de seguranca incorreta!', 'erro');
      return false;
    }

    this.token = `token_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    this.tempoLogin = Date.now();
    this.logado = true;
    localStorage.setItem('admin_token', this.token);
    localStorage.setItem('admin_tempo', String(this.tempoLogin));
    mostrarMensagem('Bem-vindo ao painel administrativo!', 'sucesso');
    return true;
  }

  logout() {
    this.logado = false;
    this.token = null;
    this.tempoLogin = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_tempo');
    mostrarMensagem('Desconectado com sucesso!', 'info');
  }

  verificarAutenticacao() {
    if (!this.logado) {
      mostrarMensagem('Voce precisa fazer login primeiro!', 'erro');
      return false;
    }
    const agora = Date.now();
    const tempoDecorrido = (agora - this.tempoLogin) / 1000 / 60;
    if (tempoDecorrido > CONFIG.ADMIN.SESSION_TIMEOUT) {
      this.logout();
      mostrarMensagem('Sua sessao expirou. Faca login novamente.', 'aviso');
      return false;
    }
    return true;
  }

  normalizarProduto(dados, produtoAtual = null) {
    const desconto = Number(dados.desconto ?? produtoAtual?.desconto ?? 0);
    if (!Number.isFinite(desconto) || desconto < 0 || desconto > 100) {
      throw new Error('Desconto deve estar entre 0% e 100%.');
    }

    const categorias = Array.isArray(dados.categorias)
      ? dados.categorias.filter(Boolean)
      : (dados.categoria ? [dados.categoria] : (Array.isArray(produtoAtual?.categorias) ? produtoAtual.categorias : []));

    const imagens = Array.isArray(dados.imagens)
      ? dados.imagens.filter(Boolean)
      : (Array.isArray(produtoAtual?.imagens) ? produtoAtual.imagens : (produtoAtual?.imagem ? [produtoAtual.imagem] : []));

    const videos = Array.isArray(dados.videos)
      ? dados.videos.filter(Boolean)
      : (Array.isArray(produtoAtual?.videos) ? produtoAtual.videos : (produtoAtual?.video ? [produtoAtual.video] : []));

    return {
      ...dados,
      desconto,
      destaqueOferta: Boolean(dados.destaqueOferta ?? produtoAtual?.destaqueOferta ?? false),
      categorias,
      categoria: categorias[0] || '',
      imagens,
      imagem: imagens[0] || '',
      videos,
      video: videos[0] || '',
    };
  }

  criarProduto(dados) {
    if (!this.verificarAutenticacao()) return null;
    if (!dados.nome || !dados.preco) {
      mostrarMensagem('Nome e preco sao obrigatorios!', 'erro');
      return null;
    }

    let normalizado;
    try {
      normalizado = this.normalizarProduto(dados);
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
      return null;
    }

    const produto = {
      id: Storage.generateId(),
      nome: normalizado.nome,
      descricao: normalizado.descricao || '',
      preco: parseFloat(normalizado.preco),
      categoria: normalizado.categoria,
      categorias: normalizado.categorias,
      imagem: normalizado.imagem,
      imagens: normalizado.imagens,
      video: normalizado.video,
      videos: normalizado.videos,
      desconto: normalizado.desconto,
      foraEstoque: Boolean(normalizado.foraEstoque),
      destaqueOferta: Boolean(normalizado.destaqueOferta),
      visivel: normalizado.visivel !== false,
      dataCriacao: Date.now(),
      dataAtualizacao: Date.now(),
    };

    const resultado = Storage.saveProduct(produto);
    if (resultado) mostrarMensagem(`Produto "${produto.nome}" criado com sucesso!`, 'sucesso');
    return resultado;
  }

  editarProduto(id, dados) {
    if (!this.verificarAutenticacao()) return null;
    const produto = Storage.getProduct(id);
    if (!produto) {
      mostrarMensagem('Produto nao encontrado!', 'erro');
      return null;
    }

    let normalizado;
    try {
      normalizado = this.normalizarProduto(dados, produto);
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
      return null;
    }

    const produtoAtualizado = {
      ...produto,
      ...normalizado,
      id,
      dataCriacao: produto.dataCriacao,
      dataAtualizacao: Date.now(),
    };

    const resultado = Storage.saveProduct(produtoAtualizado);
    if (resultado) mostrarMensagem(`Produto "${produtoAtualizado.nome}" atualizado com sucesso!`, 'sucesso');
    return resultado;
  }

  deletarProduto(id) {
    if (!this.verificarAutenticacao()) return;
    const produto = Storage.getProduct(id);
    if (!produto) {
      mostrarMensagem('Produto nao encontrado!', 'erro');
      return;
    }
    confirmarDelecao(`Voce vai deletar o produto "${produto.nome}".`, () => {
      Storage.deleteProduct(id);
      mostrarMensagem(`Produto "${produto.nome}" deletado com sucesso!`, 'sucesso');
    });
  }

  criarCategoria(nome, cor = '#007BFF') {
    if (!this.verificarAutenticacao()) return null;
    if (!nome) {
      mostrarMensagem('Nome da categoria e obrigatorio!', 'erro');
      return null;
    }
    const categoria = {
      id: Storage.generateId(),
      name: nome,
      color: cor,
      dataCriacao: Date.now(),
    };
    Storage.saveCategory(categoria);
    mostrarMensagem(`Categoria "${nome}" criada com sucesso!`, 'sucesso');
    return categoria;
  }

  editarCategoria(id, nome, cor = '#007BFF') {
    if (!this.verificarAutenticacao()) return null;
    if (!nome) {
      mostrarMensagem('Nome da categoria e obrigatorio!', 'erro');
      return null;
    }
    const categoria = Storage.getAllCategories().find((c) => c.id === id);
    if (!categoria) {
      mostrarMensagem('Categoria nao encontrada!', 'erro');
      return null;
    }
    const atualizada = { ...categoria, name: nome, color: cor || categoria.color };
    Storage.saveCategory(atualizada);
    mostrarMensagem(`Categoria "${nome}" atualizada com sucesso!`, 'sucesso');
    return atualizada;
  }

  deletarCategoria(id) {
    if (!this.verificarAutenticacao()) return;
    confirmarDelecao('Ao deletar a categoria, os produtos nao serao afetados.', () => {
      Storage.deleteCategory(id);
      mostrarMensagem('Categoria deletada com sucesso!', 'sucesso');
    });
  }

  exportarDados() {
    if (!this.verificarAutenticacao()) return;
    const dados = Storage.exportData();
    const nomeArquivo = `backup_produtos_${Date.now()}.json`;
    salvarArquivo(dados, nomeArquivo, 'application/json');
    mostrarMensagem('Backup exportado com sucesso!', 'sucesso');
  }

  importarDados(arquivo) {
    if (!this.verificarAutenticacao()) return;
    const leitor = new FileReader();
    leitor.onload = (evento) => {
      const json = evento.target.result;
      confirmarDelecao('Isto vai sobrescrever todos os dados atuais. Tem certeza?', () => {
        if (Storage.importData(json)) {
          mostrarMensagem('Dados importados com sucesso!', 'sucesso');
          setTimeout(() => window.location.reload(), 1200);
        }
      });
    };
    leitor.readAsText(arquivo);
  }

  obterEstatisticas() {
    const produtos = Storage.getAllProducts();
    const categorias = Storage.getAllCategories();
    const totalProdutos = produtos.length;
    const produtosVisiveis = produtos.filter((p) => p.visivel !== false).length;
    const produtosComDesconto = produtos.filter((p) => Number(p.desconto) > 0).length;
    const foraEstoque = produtos.filter((p) => p.foraEstoque).length;
    return {
      totalProdutos,
      produtosVisiveis,
      produtosComDesconto,
      foraEstoque,
      totalCategorias: categorias.length,
    };
  }
}

const admin = new AdminPanel();
