# Documentação Técnica do Projeto

## Estrutura
- `index.html`: página inicial.
- `catalogo.html`: catálogo com busca/filtros/ordenação.
- `produto.html`: detalhes do produto.
- `style.css`: design system e estilos globais.
- `site-dinamico.js`: lógica pública (localStorage, renderização, filtros).
- `admin/`: painel administrativo.

## Dados no localStorage
- `hs_produtos`: lista de produtos.
- `hs_categorias`: lista de categorias.
- `hs_config`: configurações visuais/empresa.
- `hs_admin_cred`: credencial de acesso do admin (protótipo).
- `hs_admin_logado`: flag de sessão persistente.

## Fluxo de catálogo
1. Lê produtos e categorias do localStorage.
2. Renderiza cards e categorias dinamicamente.
3. Aplica filtros por:
- texto
- categorias
- preço máximo (slider)
- desconto
4. Aplica ordenação.

## Slider de preço
- `max` é calculado pelo maior preço cadastrado.
- `step` é `0.01` para valores quebrados.
- visual da barra sincroniza a cada `input`.

## Painel admin
- Login persistente via localStorage (`hs_admin_logado`).
- CRUD de produtos e categorias.
- Upload de imagem no produto: selecionar arquivo + botão "Adicionar imagem".
- Reordenação das imagens por setas (↑/↓).

## Segurança (protótipo)
- Este projeto usa autenticação local apenas para prototipagem.
- Para produção: mover autenticação para backend/Firebase Auth e remover credenciais do front-end.

## Convenções
- Slug de categoria em minúsculas e com hífen.
- Preço final calculado: `precoOriginal * (1 - desconto/100)`.
- Primeira imagem do array é a principal.
