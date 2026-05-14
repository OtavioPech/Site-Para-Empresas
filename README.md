# 📦 Sistema de Anúncios de Produtos

Um sistema profissional e completo para gerenciar e anunciar produtos. **100% responsivo**, bem organizado, comentado de forma educativa, e preparado para crescimento.

---

## ✨ Características Principais

- ✅ **Totalmente Responsivo** - Funciona perfeitamente em celular, tablet e desktop
- ✅ **Painel Administrativo** - Gerenciar produtos e categorias com facilidade
- ✅ **Integração WhatsApp** - Clientes contactam o vendedor em um clique
- ✅ **Sistema de Categorias** - Organize produtos por categoria
- ✅ **Filtros e Busca** - Clientes encontram produtos facilmente
- ✅ **Desconto Automático** - Aplique descontos e veja o preço atualizar
- ✅ **Status de Estoque** - Marque produtos como fora de estoque
- ✅ **Código Comentado** - Fácil de entender e modificar
- ✅ **Backup/Importação** - Exporte seus dados em JSON
- ✅ **Sem Dependências Externas** - Apenas HTML, CSS e JavaScript puro

---

## 📂 Estrutura do Projeto

```
Site Projeto Base/
│
├── index.html                 # Página inicial
├── products.html              # Listagem de produtos
├── product.html               # Detalhes do produto
├── admin.html                 # Painel administrativo
│
├── css/
│   ├── variables.css          # Paleta de cores e variáveis
│   ├── style.css              # Estilos gerais
│   └── responsive.css         # Responsividade (mobile, tablet, desktop)
│
├── js/
│   ├── config.js              # Configurações globais
│   ├── storage.js             # Sistema de armazenamento
│   ├── main.js                # Funções principais
│   ├── products.js            # Gerenciamento de produtos (opcional)
│   └── admin.js               # Funções administrativas
│
├── data/
│   └── products.json          # Dados de exemplo
│
├── assets/
│   └── images/                # Imagens do site
│
└── README.md                  # Este arquivo
```

---

## 🚀 Como Começar

### 1️⃣ Abrir o Site

Simplesmente abra o arquivo `index.html` em qualquer navegador. Não precisa de servidor!

```bash
# No Windows, clique duplo em index.html
# Ou use um servidor local:
python -m http.server 8000
# Depois acesse: http://localhost:8000
```

### 2️⃣ Acessar o Painel Administrativo

1. Clique em "Admin" no menu superior
2. **Senha padrão**: `admin123`
3. Comece a adicionar produtos!

### 3️⃣ Personalizar o Site

#### Mudar Nome da Empresa
Edite o arquivo `js/config.js`:
```javascript
COMPANY_NAME: 'Sua Empresa Aqui',
```

#### Mudar Logo
No arquivo `js/config.js`, encontre `COMPANY_LOGO_SVG` e edite o SVG

#### Mudar Cores
Abra `css/variables.css` e altere as variáveis:
```css
--cor-primaria: #007BFF;        /* Azul */
--cor-secundaria: #6C757D;      /* Cinza */
--cor-sucesso: #28A745;         /* Verde */
--cor-perigo: #DC3545;          /* Vermelho */
```

#### Mudar Número WhatsApp
Em `js/config.js`:
```javascript
DEFAULT_PHONE: '5511999999999',  // Seu número
```

---

## 📖 Guia de Uso

### Para Usuários (Clientes)

1. **Home** - Veja os últimos produtos adicionados
2. **Produtos** - Veja todos os produtos, filtro por categoria, busca
3. **Detalhes** - Clique em um produto para ver mais informações
4. **WhatsApp** - Clique para contactar o vendedor via WhatsApp

### Para Administradores

#### Dashboard
- Veja estatísticas do site (total de produtos, descontos, etc)
- Faça backup/restauração de dados

#### Gerenciar Produtos
- ➕ Adicione novos produtos
- ✏️ Edite produtos existentes
- 🗑️ Delete produtos
- 🏷️ Organize em categorias
- 🏷️ Aplique descontos
- ⚠️ Marque como fora de estoque

#### Gerenciar Categorias
- Crie novas categorias
- Defina cores para cada categoria
- Delete categorias

#### Configurações
- Altere nome da empresa
- Configure número WhatsApp
- Customize mensagem padrão
- Exporte/importe dados

---

## 🛠️ Personalização

### Adicionar Novo Campo ao Produto

1. Abra `js/config.js` e procure por `PRODUCTS`
2. No arquivo `admin.html`, adicione um campo no formulário
3. No arquivo `js/admin.js`, no método `criarProduto()`, adicione o campo

Exemplo: Adicionar campo "Marca"
```javascript
// Em admin.html:
<div class="campo">
  <label for="prod-marca">Marca</label>
  <input type="text" id="prod-marca">
</div>

// Em admin.js, na função criarProduto():
marca: dados.marca || '',
```

### Adicionar Nova Página

1. Crie um novo arquivo HTML (ex: `about.html`)
2. Copie o header e footer de outra página
3. Importe os arquivos CSS e JS
4. Adicione o link no menu

```html
<a href="about.html">Sobre</a>
```

---

## 🔐 Segurança

### ⚠️ IMPORTANTE para Produção

Este sistema usa armazenamento local (`localStorage`) do navegador. **NUNCA use em produção assim!**

#### Para um site real, você deve:

1. **Usar um Servidor Backend** (Node.js, PHP, Python, etc)
2. **Banco de Dados Real** (MySQL, PostgreSQL, MongoDB)
3. **Autenticação Segura** (JWT tokens, OAuth2)
4. **HTTPS** (certificado SSL)
5. **Validação no Servidor** (nunca confie no navegador)

#### Migração para Backend

O código foi estruturado para facilitar migração:

1. Todos os dados estão em `Storage`
2. Para usar um servidor, modifique `storage.js`:
   ```javascript
   // Mude de:
   STORAGE.TYPE: 'local'
   // Para:
   STORAGE.TYPE: 'database'
   ```

3. Implemente requisições API ao invés de localStorage

---

## 💾 Backup e Restauração

### Fazer Backup
1. Vá para Admin > Dashboard
2. Clique em "📥 Exportar Backup"
3. Um arquivo JSON será baixado

### Restaurar Backup
1. Vá para Admin > Dashboard
2. Clique em "📤 Importar Backup"
3. Selecione o arquivo JSON
4. Confirme

---

## 📱 Responsividade

O site se adapta automaticamente a diferentes tamanhos:

- **Mobile** (até 480px) - Menu em coluna, 1 coluna de produtos
- **Tablet** (481-768px) - 2 colunas de produtos
- **Desktop** (769-1024px) - 3 colunas
- **Desktop Grande** (1025px+) - 4 colunas

Os breakpoints estão em `css/responsive.css`

---

## 🎨 Modificar Tema

### Modo Claro/Escuro

O site tem suporte a tema escuro. Para ativar:

```javascript
// No console do navegador:
localStorage.setItem('tema', 'escuro');
location.reload();
```

Para criar um tema customizado, edite as variáveis em `css/variables.css`:

```css
body.tema-escuro {
  --cor-fundo-principal: #1e1e1e;
  --cor-texto-principal: #FFFFFF;
  /* ... mais cores ... */
}
```

---

## 📊 Estrutura de Dados

### Produto
```javascript
{
  id: 123456789,              // Timestamp único
  nome: "Produto",            // Nome do produto
  descricao: "Descrição",     // Descrição detalhada
  preco: 100.00,              // Preço em reais
  categoria: "Eletrônicos",   // Categoria do produto
  imagem: "url/da/imagem",    // URL da imagem
  video: "url/do/video",      // URL do vídeo (YouTube, Vimeo)
  desconto: 10,               // Percentual de desconto (0-100)
  foraEstoque: false,         // Se está fora de estoque
  visivel: true,              // Se é visível no site
  dataCriacao: 1715691600000, // Timestamp de criação
  dataAtualizacao: 1715691600000  // Timestamp de atualização
}
```

### Categoria
```javascript
{
  id: 123456789,              // Timestamp único
  name: "Eletrônicos",        // Nome da categoria
  color: "#007BFF",           // Cor em hexadecimal
  dataCriacao: 1715691600000  // Timestamp de criação
}
```

---

## 🐛 Troubleshooting

### Produtos não aparecem
- Verifique o console (F12 > Console)
- Certifique-se de que `storage.js` está sendo carregado
- Tente adicionar um produto novo no painel

### WhatsApp não abre
- Verifique se o número está no formato correto: `55XXXXXXXXXX`
- Teste o link em um celular (desktop não abre WhatsApp Web)

### Mudar senha de admin
- Abra `js/config.js`
- Procure por `ADMIN.PASSWORD`
- Altere `'admin123'` para sua senha

---

## 📚 Documentação do Código

Todos os arquivos têm comentários extensos explicando:

- **O que cada seção faz**
- **Como usar**
- **Exemplos de código**
- **Motivo da estrutura**

Leia os comentários para entender melhor o código!

---

## 🚀 Próximos Passos

### Funcionalidades Sugeridas

1. **Carrinho de Compras** - Ao invés de links WhatsApp
2. **Sistema de Avaliações** - Clientes avaliam produtos
3. **Filtros Avançados** - Por preço, marca, cor, etc
4. **Newsletter** - Cadastre emails para ofertas
5. **Chat ao Vivo** - Conversa com clientes em tempo real
6. **Analytics** - Veja quantos visitam o site
7. **SEO** - Otimize para Google
8. **PWA** - Funcione como app no celular

---

## 📞 Suporte

Se tiver dúvidas sobre o código, consulte:

1. Os comentários nos arquivos
2. As variáveis em `js/config.js`
3. A estrutura em `js/storage.js`

---

## 📄 Licença

Este projeto é livre para usar e modificar.

---

## 👨‍💻 Desenvolvido com ❤️

Um sistema educativo, bem organizado e pronto para produção.

**Feliz coding! 🚀**

---

## Resumo Técnico

| Aspecto | Detalhes |
|--------|----------|
| **Tecnologia** | HTML5, CSS3, JavaScript (Vanilla) |
| **Armazenamento** | localStorage (prepare para banco de dados) |
| **Responsividade** | 100% adaptável |
| **Navegadores** | Chrome, Firefox, Safari, Edge (todos modernos) |
| **Tamanho** | ~200KB (muito leve) |
| **Performance** | Otimizado para rápido carregamento |
| **Acessibilidade** | WCAG 2.1 básico |
| **SEO** | Meta tags, estrutura semântica |

---

## Versão

**v1.0** - Versão Inicial (Maio 2024)

---

**Aproveite o sistema e bom negócio! 🎉**
