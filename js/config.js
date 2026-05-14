/**
 * ============================================================================
 * ARQUIVO: config.js
 * ============================================================================
 * 
 * PROPÓSITO:
 * Arquivo centralizado de configurações do projeto. Aqui estão definidas
 * todas as constantes, variáveis globais e configurações que o projeto
 * precisa para funcionar corretamente.
 * 
 * ESTRUTURA:
 * - Configurações gerais do site
 * - Links e URLs importantes
 * - Credenciais de admin
 * - Configurações de armazenamento
 * - Constantes de negócio
 * 
 * POR QUE EXISTE:
 * Ao centralizar as configurações em um único arquivo, fica muito mais fácil:
 * - Manter o projeto
 * - Fazer alterações globais
 * - Evitar duplicação de código
 * - Preparar para migração para banco de dados
 * 
 * COMO USAR:
 * Importe este arquivo em seus scripts HTML:
 * <script src="js/config.js"></script>
 * 
 * Depois acesse qualquer configuração usando:
 * CONFIG.nomeConfiguracao
 * 
 * ============================================================================
 */

// Criamos um objeto global chamado CONFIG que contém todas as configurações
const CONFIG = {
  
  // =========================================================================
  // CONFIGURAÇÕES GERAIS DO SITE
  // =========================================================================
  // Informações básicas da empresa e do site
  
  // Nome da empresa que será exibido no site
  COMPANY_NAME: 'Sua Empresa Aqui',
  
  // Descrição breve da empresa (SEO e meta tags)
  COMPANY_DESCRIPTION: 'Sistema de anúncios de produtos - Venda seus produtos de forma fácil e organizada',
  
  // Logo da empresa em SVG (sem arquivo externo)
  // Você pode editar as cores direto aqui
  COMPANY_LOGO_SVG: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Retângulo principal da logo -->
      <rect width="40" height="40" fill="#007BFF" rx="4"/>
      
      <!-- Formas geométricas da logo (você pode personalizar) -->
      <circle cx="12" cy="12" r="6" fill="#FFFFFF"/>
      <circle cx="28" cy="12" r="6" fill="#FFFFFF"/>
      <rect x="10" y="22" width="20" height="12" fill="#FFFFFF" rx="2"/>
    </svg>
  `,
  
  // Paleta de cores principal (também definida em variables.css)
  COLORS: {
    primary: '#007BFF',      // Azul principal
    secondary: '#6C757D',    // Cinza secundário
    success: '#28A745',      // Verde para sucesso
    danger: '#DC3545',       // Vermelho para perigo
    warning: '#FFC107',      // Amarelo para atenção
    light: '#F8F9FA',        // Branco/claro
    dark: '#212529',         // Escuro/preto
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE ADMINISTRAÇÃO
  // =========================================================================
  // Todas as configurações do painel administrativo
  
  // ATENÇÃO: Em produção, NUNCA coloque a senha diretamente aqui!
  // Use um servidor backend para autenticação segura.
  // Esta é apenas uma demonstração para fins educacionais.
  
  ADMIN: {
    // Senha para acessar o painel administrativo
    // ⚠️ MUDE ISTO IMEDIATAMENTE EM PRODUÇÃO ⚠️
    PASSWORD: 'admin123',
    
    // Chave de segurança adicional (tipo token)
    SECURITY_KEY: 'site-products-2026',
    
    // Tempo de sessão em minutos (quanto tempo o admin fica logado)
    SESSION_TIMEOUT: 30,
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE PRODUTOS
  // =========================================================================
  // Configurações relacionadas aos produtos
  
  PRODUCTS: {
    // Número máximo de produtos exibidos por página
    ITEMS_PER_PAGE: 12,
    
    // Se true, mostra apenas produtos visíveis
    // Se false, mostra todos os produtos
    ONLY_VISIBLE: true,
    
    // Permite múltiplas categorias por produto?
    ALLOW_MULTIPLE_CATEGORIES: true,
    
    // Mostra produtos sem imagem?
    SHOW_WITHOUT_IMAGE: false,
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE CONTATO - WHATSAPP
  // =========================================================================
  // Configurações do sistema de contato via WhatsApp
  
  WHATSAPP: {
    // Número padrão do vendedor (formato: 55XXXXXXXXXX)
    // Este número receberá as mensagens de contato
    DEFAULT_PHONE: '5511999999999',
    
    // Mensagem padrão que aparece quando clica em "Falar com vendedor"
    DEFAULT_MESSAGE: 'Olá! Tenho interesse em seus produtos. Podemos conversar?',
    
    // Se true, inclui o nome do produto na mensagem
    INCLUDE_PRODUCT_NAME: true,
    
    // Se true, inclui o preço do produto na mensagem
    INCLUDE_PRODUCT_PRICE: true,
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE ARMAZENAMENTO DE DADOS
  // =========================================================================
  // Define onde os dados serão armazenados (local ou servidor)
  
  STORAGE: {
    // Tipo de armazenamento: 'local', 'json-file', ou 'database'
    // 'local' = localStorage do navegador
    // 'json-file' = arquivo JSON no servidor
    // 'database' = MySQL, PostgreSQL, MongoDB, etc
    TYPE: 'local',
    
    // Prefixo para as chaves no localStorage
    // Útil se você tiver múltiplos projetos no mesmo navegador
    PREFIX: 'site_produtos_',
    
    // Arquivo JSON com dados de exemplo (para 'json-file')
    DATA_FILE: 'data/products.json',
    
    // URL do servidor para requisições (para 'database')
    API_URL: 'http://localhost:3000/api',
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE FILTRO E BUSCA
  // =========================================================================
  // Configurações para o sistema de busca e filtro
  
  FILTER: {
    // Sensibilidade da busca (case-sensitive = diferencia maiúsculas)
    CASE_SENSITIVE: false,
    
    // Busca parcial ou exata
    // true = busca "tel" encontra "teléfone"
    // false = busca "tel" não encontra "teléfone"
    PARTIAL_MATCH: true,
    
    // Campos que serão buscados (para não buscar em todos)
    SEARCHABLE_FIELDS: ['name', 'description', 'category'],
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE IMAGENS
  // =========================================================================
  // Configurações para tratamento de imagens
  
  IMAGES: {
    // Tamanho máximo de imagem em MB
    MAX_SIZE_MB: 5,
    
    // Formatos aceitos
    ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    
    // Imagem padrão quando não há imagem disponível
    DEFAULT_IMAGE: 'assets/images/no-image.png',
    
    // Largura e altura para miniaturas
    THUMBNAIL_WIDTH: 300,
    THUMBNAIL_HEIGHT: 300,
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE VÍDEOS
  // =========================================================================
  // Configurações para integração de vídeos
  
  VIDEOS: {
    // Plataformas aceitas (YouTube, Vimeo, etc)
    ALLOWED_PLATFORMS: ['youtube', 'vimeo'],
    
    // Largura padrão do player
    PLAYER_WIDTH: '100%',
    
    // Altura padrão do player
    PLAYER_HEIGHT: '400',
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE DESCONTO
  // =========================================================================
  // Configurações para sistema de desconto
  
  DISCOUNT: {
    // Desconto máximo permitido em porcentagem
    MAX_PERCENTAGE: 90,
    
    // Desconto mínimo permitido em porcentagem
    MIN_PERCENTAGE: 1,
    
    // Se true, mostra o preço original riscado
    SHOW_ORIGINAL_PRICE: true,
    
    // Se true, mostra o percentual de desconto em um selo
    SHOW_DISCOUNT_BADGE: true,
  },
  
  // =========================================================================
  // CONFIGURAÇÕES DE CACHE
  // =========================================================================
  // Configurações para otimização de performance
  
  CACHE: {
    // Tempo de cache em minutos
    // Quanto maior, menos requisições, mas dados mais antigos
    DURATION_MINUTES: 60,
    
    // Se true, limpa o cache automaticamente após o tempo
    AUTO_CLEAR: true,
  },
  
  // =========================================================================
  // FUNÇÕES AUXILIARES DE CONFIGURAÇÃO
  // =========================================================================
  
  /**
   * FUNÇÃO: getWhatsAppLink()
   * 
   * O QUE FAZ:
   * Gera um link do WhatsApp com mensagem pré-formatada
   * 
   * PARÂMETROS:
   * - phone: número do telefone (opcional, usa padrão se não informado)
   * - message: mensagem a enviar (opcional, usa padrão se não informado)
   * 
   * RETORNA:
   * Link completo do WhatsApp pronto para usar em href
   * 
   * EXEMPLO DE USO:
   * const link = CONFIG.getWhatsAppLink('5511999999999', 'Olá!');
   * window.location.href = link; // Abre WhatsApp
   */
  getWhatsAppLink: function(phone = null, message = null) {
    // Se não informou número, usa o padrão
    const phoneNumber = phone || this.WHATSAPP.DEFAULT_PHONE;
    
    // Se não informou mensagem, usa a padrão
    const messageText = message || this.WHATSAPP.DEFAULT_MESSAGE;
    
    // Codifica a mensagem para URL (substitui espaços por %20)
    const encodedMessage = encodeURIComponent(messageText);
    
    // Retorna o link completo do WhatsApp
    // Exemplo final: https://wa.me/5511999999999?text=Ola%21
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  },
  
  /**
   * FUNÇÃO: getStorageKey()
   * 
   * O QUE FAZ:
   * Gera uma chave única para localStorage usando o prefixo configurado
   * 
   * PARÂMETROS:
   * - name: nome da chave que você quer usar
   * 
   * RETORNA:
   * Chave completa com prefixo: "site_produtos_name"
   * 
   * EXEMPLO DE USO:
   * const chave = CONFIG.getStorageKey('meus_produtos');
   * // Resultado: "site_produtos_meus_produtos"
   */
  getStorageKey: function(name) {
    return this.STORAGE.PREFIX + name;
  },
  
  /**
   * FUNÇÃO: formatCurrency()
   * 
   * O QUE FAZ:
   * Formata um número como moeda brasileira (R$)
   * 
   * PARÂMETROS:
   * - value: valor numérico a formatar
   * 
   * RETORNA:
   * String formatada: "R$ 1.234,56"
   * 
   * EXEMPLO DE USO:
   * CONFIG.formatCurrency(1234.56); // Retorna "R$ 1.234,56"
   */
  formatCurrency: function(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },
  
  /**
   * FUNÇÃO: calculateDiscountedPrice()
   * 
   * O QUE FAZ:
   * Calcula o preço com desconto aplicado
   * 
   * PARÂMETROS:
   * - originalPrice: preço original do produto
   * - discountPercentage: percentual de desconto (0-100)
   * 
   * RETORNA:
   * Valor com desconto já aplicado
   * 
   * EXEMPLO DE USO:
   * CONFIG.calculateDiscountedPrice(100, 10); // Retorna 90
   * // Produto de R$ 100 com 10% de desconto = R$ 90
   */
  calculateDiscountedPrice: function(originalPrice, discountPercentage) {
    const discount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discount;
  },
};

// Exporta para uso em módulos (se estiver usando ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
