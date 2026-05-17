# ðŸ“‹ INSTRUÇÃ•ES DE DESENVOLVIMENTO — PAINEL ADMINISTRATIVO
## HS Sistemas Agrícolas — Sistema de Gestão do Site

---

## VISÃƒO GERAL

Este documento descreve o que deve ser desenvolvido para o **painel de administração** do site da HS Sistemas Agrícolas. O painel permite que o administrador gerencie todo o conteúdo do site sem precisar tocar no código HTML/CSS.

O acesso ao painel é feito pelo **rodapé do site** — um símbolo `©` quase invisível que, ao ser clicado, leva para `admin/login.html`.

---

## ARQUIVOS A CRIAR

```
admin/
  login.html          â† Tela de login
  dashboard.html      â† Painel principal
  produtos.html       â† Lista e gestão de produtos
  produto-form.html   â† Formulário de novo produto / editar produto
  categorias.html     â† Gestão de categorias
  configuracoes.html  â† Configurações gerais do site
  style-admin.css     â† CSS do painel admin
  admin.js            â† Lógica JavaScript / localStorage
```

---

## 1. TELA DE LOGIN (`admin/login.html`)

### O que fazer:
- Criar uma tela de login simples, centralizada, com a logo da empresa no topo.
- Campos: **Usuário** e **Senha**.
- Botão "Entrar".
- Ao submeter, verificar as credenciais salvas no `localStorage` (ou hardcoded no JS como padrão inicial: `admin` / `hs2026`).
- Se correto: redirecionar para `dashboard.html`.
- Se incorreto: exibir mensagem de erro em vermelho abaixo do formulário.
- A URL não deve indicar claramente que é um painel (usar `/admin/login.html` mas o HTML pode ter título genérico como "Área Restrita").
- Adicionar proteção: se o usuário já estiver logado (verificar `sessionStorage`), redirecionar direto para o dashboard.

### Campos do formulário:
```
[ ðŸ”’ Usuário    ]
[ ðŸ”‘ Senha      ]
[ Entrar â†’      ]
```

---

## 2. DASHBOARD PRINCIPAL (`admin/dashboard.html`)

### O que fazer:
- Navbar lateral fixa com links para:
  - ðŸ  Dashboard
  - ðŸ“¦ Produtos
  - ðŸ·ï¸ Categorias
  - âš™ï¸ Configurações
  - ðŸšª Sair (limpar sessão e redirecionar para login)
- Área principal com cards de resumo:
  - Total de produtos cadastrados
  - Quantos estão em destaque
  - Quantos têm desconto ativo
  - Número de categorias
- Atalhos rápidos: "Adicionar Produto", "Nova Categoria", "Ir para o Site"
- Botão "Ver Site" que abre `../index.html` em nova aba

### Proteção de rota:
- Todo arquivo do admin deve verificar no início do JS:
  ```javascript
  if (!sessionStorage.getItem('admin_logado')) {
    window.location.href = 'login.html';
  }
  ```

---

## 3. GESTÃƒO DE PRODUTOS (`admin/produtos.html`)

### O que fazer:
- Tabela/lista com todos os produtos cadastrados.
- Cada linha deve mostrar:
  - Miniatura da imagem principal
  - Nome do produto
  - Código (ex: 5161)
  - Categorias (tags)
  - Preço original
  - Desconto (em %)
  - Preço final (calculado automaticamente)
  - Destaque: sim/não (toggle rápido)
  - Botões: Editar | Excluir
- Barra de busca por nome ou código.
- Botão "Novo Produto" que leva para `produto-form.html`.
- Opção de **ordenar** por nome, preço, desconto ou destaque.
- Ao excluir: exibir caixa de confirmação ("Tem certeza?").

### Armazenamento:
- Todos os produtos ficam no `localStorage` como JSON:
  ```javascript
  // Chave: 'hs_produtos'
  // Valor: array de objetos produto
  [
    {
      id: "prod_1",
      codigo: "5161",
      nome: "Kit Plataforma de Milho — Case",
      descricao: "Equipamento composto por...",
      categorias: ["kits-case", "milho"],
      precoOriginal: 2000.00,
      desconto: 15,             // porcentagem (0 = sem desconto)
      precoFinal: 1700.00,      // calculado: precoOriginal * (1 - desconto/100)
      destaque: true,
      imagens: ["url1.jpg", "url2.jpg", "url3.jpg"],
      videos: ["https://youtube.com/..."],
      criadoEm: "2026-01-15",
      ativo: true
    }
  ]
  ```

---

## 4. FORMULÁRIO DE PRODUTO (`admin/produto-form.html`)

### Serve para criar E editar produtos (mesmo arquivo, com `?id=xxx` na URL para edição).

### Campos do formulário:

#### Informações básicas:
- **Nome do produto** (texto, obrigatório)
- **Código** (texto, ex: 5161, obrigatório)
- **Descrição** (textarea com mais espaço, suporta quebras de linha)

#### Categorias:
- Lista de checkboxes com todas as categorias cadastradas
- O produto pode pertencer a **múltiplas categorias** ao mesmo tempo
- Botão "+ Nova categoria" que abre um mini-modal para criar uma nova categoria sem sair da página

#### Preço e Desconto:
- **Preço Original** (campo numérico, em reais)
- **Desconto (%)** (número de 0 a 100, padrão = 0)
- **Preço Final** (campo desabilitado, atualizado automaticamente ao digitar)
  - Lógica: `precoFinal = precoOriginal * (1 - desconto / 100)`
  - Se desconto = 0, preço final = preço original
  - Exibir em tempo real com JavaScript enquanto o usuário digita

#### Destaque:
- **Toggle (checkbox grande)**: "Mostrar este produto em destaque na página inicial"
- Explicação abaixo: "Produtos em destaque aparecem na seção principal do site. Se não houver produtos em destaque, o sistema exibirá automaticamente os com maior desconto e depois os normais."

#### Imagens:
- **Área de upload múltiplo**: botão "Adicionar Imagem" que aceita `<input type="file" multiple>`
- Exibir pré-visualização de cada imagem adicionada com:
  - Miniatura da imagem
  - Botão "Ã—" para remover
  - Botão de arrastar para reordenar (drag-and-drop ou botões â–²â–¼)
- A primeira imagem da lista é considerada a **imagem principal**
- Armazenar imagens como Base64 no localStorage (para prototipagem) ou como URLs (para produção)

#### Vídeos:
- Campo de texto para **URL do YouTube** (ou outro serviço)
- Botão "+ Adicionar vídeo"
- Lista de vídeos adicionados com botão de remover
- Ao exibir no site, usar o link do embed do YouTube

#### Botões de ação:
- **Salvar Produto** (cria novo ou atualiza existente)
- **Cancelar** (volta para lista de produtos)
- **Excluir** (só aparece na edição, com confirmação)

---

## 5. GESTÃƒO DE CATEGORIAS (`admin/categorias.html`)

### O que fazer:
- Lista de todas as categorias cadastradas
- Cada categoria deve ter:
  - **Nome** (ex: "Kits Case", "John Deere", "Peças")
  - **Slug** (ex: "kits-case", "john-deere") — gerado automaticamente a partir do nome
  - **Ãcone/Emoji** (campo de texto para emoji, ex: ðŸ”´)
  - **Descrição curta** (opcional)
  - Contagem de produtos nessa categoria (calculada automaticamente)
- Botão "Nova Categoria"
- Cada linha tem botões: Editar | Excluir
- Não permitir excluir categoria que tenha produtos vinculados (mostrar aviso)

### Armazenamento:
```javascript
// Chave: 'hs_categorias'
[
  {
    id: "cat_1",
    nome: "Kits Case",
    slug: "kits-case",
    emoji: "ðŸ”´",
    descricao: "Soluções desenvolvidas especialmente para colheitadeiras Case.",
    ordem: 1
  }
]
```

### Categorias iniciais sugeridas (pré-carregar se não houver dados):
- ðŸ”´ Kits Case
- ðŸŸ¢ Kits John Deere
- ðŸŸ¡ Kits New Holland
- ðŸŸ¤ Massey Ferguson
- âš™ï¸ Peças e Sensores
- ðŸŒ½ Plataforma de Milho
- ðŸ«˜ Plataforma de Soja
- ðŸŒ¾ Plataforma de Trigo

---

## 6. CONFIGURAÇÃ•ES DO SITE (`admin/configuracoes.html`)

### O que fazer:
Tela dividida em seções:

---

### 6.1 Identidade da Empresa
- **Nome da empresa** (texto) â†’ usado no header, footer, título das páginas
- **Logo** (upload de imagem) â†’ substitui o ícone "HS" no header
- **Descrição da empresa** (textarea) â†’ aparece no footer e na seção "Sobre"
- **Número do WhatsApp** (texto, formato: 5545999999999) â†’ usado em todos os botões de WhatsApp do site
- **Versículo/Slogan** (texto) â†’ aparece no footer e na hero

---

### 6.2 Paleta de Cores

Exibir 3 campos de seleção de cor com pré-visualização:

| Campo | Variável CSS | Padrão | Uso |
|-------|-------------|--------|-----|
| Cor Principal | `--cor-primaria` | `#1B3A6B` | Header, títulos, botões |
| Cor de Destaque/Acento | `--cor-destaque` | `#E8A020` | Botões de ação, badges, detalhes |
| Cor Escura | `--cor-escura` | `#0D1F3C` | Footer, fundos escuros |

- Usar `<input type="color">` para cada campo
- Mostrar pré-visualização ao vivo: quando o usuário troca uma cor, atualizar as variáveis CSS da própria página do admin em tempo real usando:
  ```javascript
  document.documentElement.style.setProperty('--cor-primaria', novaCor);
  ```
- Salvar no localStorage como `hs_config`
- Ao carregar o site público, ler essas cores do localStorage e aplicar via JS no `<head>`:
  ```javascript
  const config = JSON.parse(localStorage.getItem('hs_config') || '{}');
  if (config.corPrimaria) {
    document.documentElement.style.setProperty('--cor-primaria', config.corPrimaria);
  }
  // etc.
  ```

---

### 6.3 Credenciais de Acesso
- Campos para alterar **usuário** e **senha** do painel admin
- Campo "Confirmar nova senha"
- Botão "Atualizar Credenciais"
- Salvar em `localStorage` com hash simples (ou sem hash para protótipo)

---

### 6.4 Botão "Salvar Configurações"
- Salva tudo no localStorage com a chave `hs_config`
- Exibir mensagem de sucesso: "âœ… Configurações salvas com sucesso!"

---

## 7. SISTEMA DE HIERARQUIA DE PRODUTOS NA HOME

### Lógica a implementar no `index.html` (carregar via JS):

```
Ao carregar a página inicial, o JS deve buscar os produtos do localStorage
e exibi-los na seção "Produtos em Destaque" seguindo esta ordem:

PRIORIDADE 1: Produtos com destaque = true
  â†’ Ordenados por: maior desconto primeiro
  
PRIORIDADE 2: Produtos com desconto > 0 (sem destaque)
  â†’ Ordenados por: maior percentual de desconto primeiro

PRIORIDADE 3: Produtos normais (sem destaque, sem desconto)
  â†’ Ordenados por: data de criação (mais recente primeiro)

REGRA IMPORTANTE: A seção nunca ficará vazia.
Se não houver produtos em destaque, o sistema usa os de desconto.
Se não houver produtos com desconto, usa os normais.
Sempre mostrar no mínimo 4 e no máximo 8 produtos na home.
```

### Código exemplo:
```javascript
function carregarDestaques() {
  const produtos = JSON.parse(localStorage.getItem('hs_produtos') || '[]')
    .filter(p => p.ativo);

  const comDestaque = produtos
    .filter(p => p.destaque)
    .sort((a, b) => b.desconto - a.desconto);

  const comDesconto = produtos
    .filter(p => !p.destaque && p.desconto > 0)
    .sort((a, b) => b.desconto - a.desconto);

  const normais = produtos
    .filter(p => !p.destaque && p.desconto === 0)
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

  const hierarquia = [...comDestaque, ...comDesconto, ...normais];
  const exibir = hierarquia.slice(0, 8); // máximo 8 na home

  renderizarProdutos(exibir);
}
```

---

## 8. INTEGRAÇÃƒO DAS CONFIGURAÇÃ•ES COM O SITE PÚBLICO

### Adicionar no `<head>` de todos os arquivos do site (`index.html`, `catalogo.html`, `produto.html`):

```html
<script>
  // Carregar configurações do admin
  (function() {
    const config = JSON.parse(localStorage.getItem('hs_config') || '{}');
    const root = document.documentElement;
    if (config.corPrimaria) root.style.setProperty('--cor-primaria', config.corPrimaria);
    if (config.corDestaque)  root.style.setProperty('--cor-destaque',  config.corDestaque);
    if (config.corEscura)    root.style.setProperty('--cor-escura',    config.corEscura);
  })();
</script>
```

Depois, ao carregar o body, aplicar nome da empresa, WhatsApp, etc.

---

## 9. CONSIDERAÇÃ•ES TÉCNICAS

### Armazenamento:
- Usar `localStorage` para todos os dados (zero backend necessário para protótipo)
- Para produção real, substituir localStorage por chamadas a uma API ou banco de dados (Firebase Firestore é uma boa opção gratuita)

### Limitação do localStorage:
- Máximo ~5MB por domínio
- Imagens em Base64 consomem muito espaço — considerar limitar o tamanho das imagens (max 500KB cada) ou usar URLs externas (Imgur, Cloudinary, etc.)

### Segurança:
- O login por localStorage é apenas visual — não tem segurança real
- Para um site em produção, implementar autenticação server-side ou Firebase Auth

### Responsividade do Admin:
- O painel admin não precisa ser mobile-first, mas deve funcionar em tablets
- Sidebar pode colapsar em telas menores de 768px

---

## 10. FLUXO COMPLETO DO USUÁRIO ADMIN

```
1. Acessa o site público
2. Clica discretamente no © no rodapé
3. É redirecionado para admin/login.html
4. Faz login com usuário e senha
5. Vê o dashboard com resumo
6. Vai em "Produtos" â†’ vê lista
7. Clica "Novo Produto"
8. Preenche: nome, código, descrição, escolhe categorias,
   define preço, aplica desconto (preço final atualiza em tempo real),
   marca como destaque se quiser, faz upload das fotos, adiciona URL de vídeo
9. Salva â†’ produto aparece no site público automaticamente
10. Vai em "Configurações" â†’ muda a cor principal do site
11. Salva â†’ o site adapta as cores automaticamente
12. Clica "Ver Site" â†’ abre a página inicial com as novas cores e produtos
```

---

## RESUMO DAS TECNOLOGIAS SUGERIDAS

| Componente | Tecnologia |
|-----------|------------|
| Frontend | HTML, CSS, JavaScript puro |
| Armazenamento | localStorage (protótipo) / Firebase (produção) |
| Upload de imagens | FileReader API + Base64 ou Cloudinary |
| Cores em tempo real | CSS Custom Properties (variáveis CSS) |
| Autenticação | sessionStorage (protótipo) / Firebase Auth (produção) |
| Drag-and-drop de imagens | SortableJS (CDN gratuito) |

---

*Documento gerado para o desenvolvimento do painel administrativo da HS Sistemas Agrícolas.*
*Baseado no portfólio de produtos 2026.*

