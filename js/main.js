/**
 * ============================================================================
 * ARQUIVO: main.js
 * ============================================================================
 * 
 * PROPÓSITO:
 * Funções JavaScript globais e utilitários que são usados em
 * TODAS as páginas do site.
 * 
 * EXEMPLOS:
 * - Formatar moeda
 * - Mostrar/esconder elementos
 * - Validar formulários
 * - Manipular URLs
 * - Inicializar componentes
 * 
 * ESTRUTURA:
 * Este arquivo é importado em TODOS os HTML files
 * 
 * ============================================================================
 */

/**
 * FUNÇÃO: formatarData()
 * 
 * O QUE FAZ:
 * Converte timestamp em data legível (Ex: "14 de maio de 2024")
 * 
 * PARÂMETROS:
 * - timestamp: número com data em milissegundos
 * 
 * RETORNA:
 * String com data formatada no Brasil
 */
function formatarData(timestamp) {
  const data = new Date(timestamp);
  return data.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * FUNÇÃO: formatarHora()
 * 
 * O QUE FAZ:
 * Converte timestamp em hora legível (Ex: "14:30")
 */
function formatarHora(timestamp) {
  const data = new Date(timestamp);
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * FUNÇÃO: mostrarMensagem()
 * 
 * O QUE FAZ:
 * Exibe uma mensagem na tela (sucesso, erro, aviso, etc)
 * 
 * PARÂMETROS:
 * - mensagem: texto a mostrar
 * - tipo: 'sucesso', 'erro', 'aviso' ou 'info'
 * - duracao: tempo em ms para desaparecer (0 = não desaparece)
 */
function mostrarMensagem(mensagem, tipo = 'info', duracao = 4000) {
  // Cria elemento da mensagem
  const div = document.createElement('div');
  div.className = `mensagem mensagem-${tipo}`;
  div.textContent = mensagem;
  
  // Adiciona ao topo da página
  document.body.insertBefore(div, document.body.firstChild);
  
  // Se tem duração, remove depois
  if (duracao > 0) {
    setTimeout(() => {
      div.remove();
    }, duracao);
  }
  
  return div;
}

/**
 * FUNÇÃO: obterParametroURL()
 * 
 * O QUE FAZ:
 * Pega um parâmetro da URL
 * Ex: se URL é "page.html?id=123", obtém id=123
 * 
 * PARÂMETROS:
 * - nome: nome do parâmetro
 * 
 * RETORNA:
 * Valor do parâmetro ou null
 * 
 * EXEMPLO DE USO:
 * const id = obterParametroURL('id');
 * // Se URL = "product.html?id=456", retorna "456"
 */
function obterParametroURL(nome) {
  // URLSearchParams facilita trabalhar com parâmetros de URL
  const params = new URLSearchParams(window.location.search);
  return params.get(nome);
}

/**
 * FUNÇÃO: validarEmail()
 * 
 * O QUE FAZ:
 * Verifica se um email é válido
 * 
 * PARÂMETROS:
 * - email: string com email
 * 
 * RETORNA:
 * true se válido, false se não
 */
function validarEmail(email) {
  // Expressão regular para validar email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * FUNÇÃO: validarTelefone()
 * 
 * O QUE FAZ:
 * Verifica se um telefone tem formato válido
 * 
 * PARÂMETROS:
 * - telefone: string com telefone
 * 
 * RETORNA:
 * true se válido, false se não
 */
function validarTelefone(telefone) {
  // Remove caracteres que não são números
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Deve ter 10 ou 11 dígitos
  return apenasNumeros.length === 10 || apenasNumeros.length === 11;
}

/**
 * FUNÇÃO: copiarParaClipboard()
 * 
 * O QUE FAZ:
 * Copia um texto para a área de transferência
 * 
 * PARÂMETROS:
 * - texto: texto a copiar
 * 
 * EXEMPLO DE USO:
 * copiarParaClipboard('texto para copiar');
 * // Agora pode fazer Ctrl+V
 */
function copiarParaClipboard(texto) {
  // API moderna para clipboard
  navigator.clipboard.writeText(texto).then(() => {
    mostrarMensagem('Copiado para área de transferência!', 'sucesso');
  }).catch(() => {
    alert('Erro ao copiar');
  });
}

/**
 * FUNÇÃO: abrirModal()
 * 
 * O QUE FAZ:
 * Abre um modal (janela pop-up) na tela
 * 
 * PARÂMETROS:
 * - modalId: ID do elemento modal HTML
 * 
 * EXEMPLO DE USO:
 * // HTML: <div id="meu-modal" class="modal-backdrop">...</div>
 * abrirModal('meu-modal');
 */
function abrirModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Impede scroll da página
  }
}

/**
 * FUNÇÃO: fecharModal()
 * 
 * O QUE FAZ:
 * Fecha um modal aberto
 * 
 * PARÂMETROS:
 * - modalId: ID do elemento modal HTML
 */
function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Volta scroll normal
  }
}

/**
 * FUNÇÃO: confirmarDelecao()
 * 
 * O QUE FAZ:
 * Mostra uma janela de confirmação antes de deletar algo
 * 
 * PARÂMETROS:
 * - mensagem: o que será deletado
 * - callback: função a executar se confirmar
 * 
 * EXEMPLO DE USO:
 * confirmarDelecao('Este produto será deletado permanentemente', () => {
 *   Storage.deleteProduct(123);
 * });
 */
function confirmarDelecao(mensagem, callback) {
  // Cria o modal de confirmação
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="max-width: 400px;">
      <div class="modal-header">
        <h2 class="modal-titulo">⚠️ Confirmação</h2>
        <button class="modal-fechar" onclick="this.closest('.modal-backdrop').remove()">×</button>
      </div>
      <div class="modal-corpo">
        <p>${mensagem}</p>
        <p style="margin-top: var(--espaco-grande); color: var(--cor-texto-secundario); font-size: var(--tamanho-fonte-pequeno);">
          Esta ação não pode ser desfeita.
        </p>
      </div>
      <div class="modal-footer">
        <button class="botao botao-secundario" onclick="this.closest('.modal-backdrop').remove();">Cancelar</button>
        <button class="botao botao-perigo" id="confirmar-btn">Deletar</button>
      </div>
    </div>
  `;
  
  // Adiciona modal ao documento
  document.body.appendChild(modal);
  
  // Evento do botão confirmar
  modal.querySelector('#confirmar-btn').addEventListener('click', () => {
    callback();
    modal.remove();
  });
  
  // Fecha ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

/**
 * FUNÇÃO: renderizarEstrelas()
 * 
 * O QUE FAZ:
 * Cria um elemento visual de estrelas (avaliação)
 * 
 * PARÂMETROS:
 * - estrelas: número de 1 a 5
 * 
 * RETORNA:
 * String HTML com as estrelas
 * 
 * EXEMPLO DE USO:
 * const html = renderizarEstrelas(4);
 * // Retorna: "★★★★☆"
 */
function renderizarEstrelas(estrelas) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= estrelas) {
      html += '★'; // Estrela cheia
    } else {
      html += '☆'; // Estrela vazia
    }
  }
  return html;
}

/**
 * FUNÇÃO: carregarCOMO ARQUIVO EXTERNO
 * 
 * O QUE FAZ:
 * Carrega um arquivo externo via AJAX
 * 
 * PARÂMETROS:
 * - url: caminho do arquivo
 * - callback: função com o conteúdo carregado
 */
function carregarArquivo(url, callback) {
  fetch(url)
    .then(response => response.text())
    .then(data => callback(data))
    .catch(error => console.error('Erro ao carregar arquivo:', error));
}

/**
 * FUNÇÃO: salvarArquivo()
 * 
 * O QUE FAZ:
 * Faz download de um arquivo (Ex: JSON com backup)
 * 
 * PARÂMETROS:
 * - conteudo: texto a salvar
 * - nomeArquivo: nome do arquivo
 * - tipo: tipo de arquivo (json, csv, txt, etc)
 */
function salvarArquivo(conteudo, nomeArquivo, tipo = 'text/plain') {
  // Cria um blob (dados binários)
  const blob = new Blob([conteudo], { type: tipo });
  
  // Cria URL para download
  const url = URL.createObjectURL(blob);
  
  // Cria um link e clica nele
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  
  // Limpa
  URL.revokeObjectURL(url);
}

/**
 * FUNÇÃO: inicializarTemas()
 * 
 * O QUE FAZ:
 * Inicializa o sistema de temas (claro/escuro) se estiver definido
 * 
 * COMO USAR:
 * Adicione no primeiro script que carrega
 */
function inicializarTemas() {
  // Verifica se o navegador suporta modo escuro
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Usuário tem modo escuro ativado no sistema
    const temaPref = localStorage.getItem('tema') || 'auto';
    
    if (temaPref === 'escuro' || (temaPref === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('tema-escuro');
    }
  }
}

/**
 * FUNÇÃO: alternarTema()
 * 
 * O QUE FAZ:
 * Alterna entre tema claro e escuro
 */
function alternarTema() {
  const temaAtual = document.body.classList.contains('tema-escuro') ? 'escuro' : 'claro';
  const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';
  
  if (novoTema === 'escuro') {
    document.body.classList.add('tema-escuro');
  } else {
    document.body.classList.remove('tema-escuro');
  }
  
  localStorage.setItem('tema', novoTema);
  mostrarMensagem(`Tema alterado para ${novoTema}`, 'info');
}

// Inicializa temas ao carregar
document.addEventListener('DOMContentLoaded', inicializarTemas);
