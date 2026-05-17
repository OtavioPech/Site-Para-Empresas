/*
 * site-dinamico.js
 * Camada de comportamento do site público.
 * - Carrega dados do localStorage
 * - Renderiza home/catálogo/produto
 * - Aplica filtros, ordenação e configurações
 * MANUTENÇÃO: alterar somente funções específicas por página.
 */

(function(){
  const K={prod:'hs_produtos',cat:'hs_categorias',cfg:'hs_config',cred:'hs_admin_cred'};
  const get=(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d));
  const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const fmt=(n)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n||0);

  function boot(){
    if(!localStorage.getItem(K.cat)) set(K.cat,[
      {id:'cat_1',nome:'Kits Case',slug:'case',emoji:'🔴',descricao:'',ordem:1},
      {id:'cat_2',nome:'Kits John Deere',slug:'john-deere',emoji:'🟢',descricao:'',ordem:2},
      {id:'cat_3',nome:'Kits New Holland',slug:'new-holland',emoji:'🟡',descricao:'',ordem:3},
      {id:'cat_4',nome:'Massey Ferguson',slug:'massey',emoji:'🟤',descricao:'',ordem:4},
      {id:'cat_5',nome:'Peças e Sensores',slug:'pecas',emoji:'⚙️',descricao:'',ordem:5}
    ]);
    if(!localStorage.getItem(K.prod)) set(K.prod,[]);
    if(!localStorage.getItem(K.cfg)) set(K.cfg,{nomeEmpresa:'HS Sistemas Agrícolas',descricaoEmpresa:'Soluções em tecnologia para o campo.',whatsapp:'5545999999999',versiculo:'Pv. 16:3',corPrimaria:'#1B3A6B',corDestaque:'#E8A020',corEscura:'#0D1F3C'});
    if(!localStorage.getItem(K.cred)) set(K.cred,{usuario:'admin',senha:'hs2026'});
  }

  function applyConfig(){
    const c=get(K.cfg,{}),r=document.documentElement;
    if(c.corPrimaria) r.style.setProperty('--cor-primaria',c.corPrimaria);
    if(c.corDestaque) r.style.setProperty('--cor-destaque',c.corDestaque);
    if(c.corEscura) r.style.setProperty('--cor-escura',c.corEscura);
    document.querySelectorAll('.footer__brand h3').forEach(x=>x.textContent=c.nomeEmpresa||x.textContent);
    document.querySelectorAll('.footer__brand p').forEach(x=>x.textContent=c.descricaoEmpresa||x.textContent);
    document.querySelectorAll('.footer__versicle').forEach(x=>x.textContent=c.versiculo||x.textContent);
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{
      const txt=(a.href.split('text=')[1]||'Olá!').replace(/\+/g,'%20');
      a.href=`https://wa.me/${c.whatsapp||'5545999999999'}?text=${txt}`;
    });
  }

  function card(p){
    const precoTem=Number(p.precoOriginal)>0;
    const final=Number(p.precoFinal||p.precoOriginal||0);
    const original=Number(p.precoOriginal||0);
    const desconto=Number(p.desconto||0);
    const cats=(p.categorias||[]).join(',');
    const catsLabel=(p.categorias||[]).join(' · ');
    return `<a href="produto.html?id=${p.id}" class="produto-card" data-id="${p.id}" data-categorias="${cats}" data-desconto="${desconto}" data-preco="${precoTem?final:0}">
      <div class="produto-card__badge">${desconto>0?`<span class="badge badge--desconto">-${desconto}%</span>`:''}${p.destaque?'<span class="badge badge--destaque">⭐ Destaque</span>':''}</div>
      <div class="produto-card__img-wrap"><img src="${(p.imagens&&p.imagens[0])||''}" alt="${p.nome}" class="produto-card__imagem" onerror="this.style.background='#e8e0d0';this.removeAttribute('src')"/></div>
      <div class="produto-card__corpo"><span class="produto-card__codigo">Cód: ${p.codigo}</span><h3 class="produto-card__nome">${p.nome}</h3><span class="produto-card__categoria">${catsLabel}</span><div class="produto-card__precos">${precoTem&&desconto>0?`<span class="preco-original">${fmt(original)}</span>`:''}<span class="preco-atual ${desconto>0?'com-desconto':''}">${precoTem?fmt(final):'Consulte o preço'}</span></div></div>
    </a>`;
  }

  function loadHome(){
    const grid=document.querySelector('.destaques .produtos-grid'); if(!grid) return;
    const prods=get(K.prod,[]).filter(p=>p.ativo!==false);
    const a=prods.filter(p=>p.destaque).sort((x,y)=>(y.desconto||0)-(x.desconto||0));
    const b=prods.filter(p=>!p.destaque&&(p.desconto||0)>0).sort((x,y)=>(y.desconto||0)-(x.desconto||0));
    const c=prods.filter(p=>!p.destaque&&(p.desconto||0)===0).sort((x,y)=>new Date(y.criadoEm)-new Date(x.criadoEm));
    grid.innerHTML=[...a,...b,...c].slice(0,8).map(card).join('');
  }

  function loadCatalog(){
    const grid=document.getElementById('produtosGrid'); if(!grid) return;
    const prods=get(K.prod,[]).filter(p=>p.ativo!==false);
    const cats=get(K.cat,[]).sort((a,b)=>(a.ordem||0)-(b.ordem||0));
    grid.innerHTML=prods.map(card).join('');

    const catGroups=document.querySelectorAll('.filtro-grupo .filtro-cats');
    const catWrap=catGroups[0];
    if(catWrap){
      const bySlug={};
      prods.forEach(p=>(p.categorias||[]).forEach(s=>bySlug[s]=(bySlug[s]||0)+1));
      catWrap.innerHTML=cats.map(c=>`<div class="filtro-cat-item" data-slug="${c.slug}" onclick="toggleCategoria(this)"><input type="checkbox"/><label class="filtro-cat-label"><span class="filtro-cat-check"></span>${c.nome}</label><span class="filtro-cat-count">${bySlug[c.slug]||0}</span></div>`).join('');
    }

    if(catGroups[1]){ catGroups[1].innerHTML=''; const gTitle=catGroups[1].previousElementSibling; if(gTitle) gTitle.parentElement.style.display='none'; }

    const slider=document.getElementById('sliderPreco');
    const precoValor=document.getElementById('precoValor');
    const maxPrice=Math.max(0,...prods.map(p=>Number(p.precoFinal||p.precoOriginal||0)));
    const top=maxPrice>0?Number(maxPrice.toFixed(2)):100;
    if(slider){
      slider.min='0';
      slider.max=String(top);
      slider.step='0.01';
      slider.value=String(top);
      const labels=slider.parentElement?.querySelectorAll('div span');
      if(labels&&labels.length===2){ labels[0].textContent='R$ 0'; labels[1].textContent=`R$ ${top.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
    }

    function updateSliderVisual(val){
      const max=Number(slider?.max||1);
      const pct=max>0?(Number(val)/max)*100:100;
      if(slider) slider.style.background=`linear-gradient(to right, var(--cor-primaria) 0%, var(--cor-primaria) ${pct}%, var(--cor-borda) ${pct}%)`;
      if(precoValor) precoValor.textContent=`Até R$ ${Number(val).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    }

    function renderActiveTags(selectedCats){
      const box=document.getElementById('filtrosAtivos'); if(!box) return;
      const tags=[];
      selectedCats.forEach(s=>{ const c=cats.find(x=>x.slug===s); if(c) tags.push(`<span class="filtro-tag" data-tag="${s}">${c.nome}<button type="button" onclick="removerFiltroTag('${s}')">×</button></span>`); });
      box.innerHTML=tags.join('');
    }

    function applyFilter(){
      const query=(document.getElementById('campoBusca')?.value||'').toLowerCase();
      const selectedCats=[...document.querySelectorAll('.filtro-cat-item.ativo')].map(el=>el.dataset.slug).filter(Boolean);
      const maxPriceVal=Number(slider?.value||top);
      const descontoRadio=document.querySelector('input[name="desconto"]:checked')?.value||'qualquer';
      const order=document.getElementById('ordenacao')?.value||'relevancia';

      let cards=[...grid.querySelectorAll('.produto-card')];
      cards.forEach(c=>{
        const nome=(c.querySelector('.produto-card__nome')?.textContent||'').toLowerCase();
        const cod=(c.querySelector('.produto-card__codigo')?.textContent||'').toLowerCase();
        const cts=(c.dataset.categorias||'').split(',').filter(Boolean);
        const preco=Number(c.dataset.preco||0);
        const desc=Number(c.dataset.desconto||0);
        const okBusca=!query||nome.includes(query)||cod.includes(query);
        const okCat=!selectedCats.length||selectedCats.some(s=>cts.includes(s));
        const okPreco=preco<=maxPriceVal || preco===0;
        const okDesc=descontoRadio==='qualquer'||(descontoRadio==='apenas'&&desc>0)||(!isNaN(Number(descontoRadio))&&desc>=Number(descontoRadio));
        c.style.display=(okBusca&&okCat&&okPreco&&okDesc)?'':'none';
      });

      cards=[...grid.querySelectorAll('.produto-card')].filter(c=>c.style.display!=='none');
      cards.sort((a,b)=>{
        const pa=Number(a.dataset.preco||0), pb=Number(b.dataset.preco||0);
        const da=Number(a.dataset.desconto||0), db=Number(b.dataset.desconto||0);
        const na=a.querySelector('.produto-card__nome')?.textContent||'', nb=b.querySelector('.produto-card__nome')?.textContent||'';
        if(order==='menor-preco') return pa-pb;
        if(order==='maior-preco') return pb-pa;
        if(order==='maior-desconto') return db-da;
        if(order==='nome-az') return na.localeCompare(nb,'pt-BR');
        return 0;
      });
      cards.forEach(c=>grid.appendChild(c));

      const total=cards.length;
      const totalEl=document.getElementById('totalProdutos'); if(totalEl) totalEl.textContent=String(total);
      const rc=document.getElementById('resultadosCount'); if(rc) rc.innerHTML=`Mostrando <strong>${total}</strong> produtos`;
      renderActiveTags(selectedCats);
    }

    window.filtrarProdutos=applyFilter;
    window.toggleCategoria=function(el){ el.classList.toggle('ativo'); applyFilter(); };
    window.removerFiltroTag=function(slug){
      const item=document.querySelector(`.filtro-cat-item[data-slug="${slug}"]`);
      if(item) item.classList.remove('ativo');
      applyFilter();
    };
    window.limparFiltros=function(){
      const busca=document.getElementById('campoBusca'); if(busca) busca.value='';
      document.querySelectorAll('.filtro-cat-item').forEach(el=>el.classList.remove('ativo'));
      if(slider) slider.value=String(top);
      const dq=document.getElementById('desc-qualquer'); if(dq) dq.checked=true;
      updateSliderVisual(top);
      applyFilter();
    };
    window.atualizarPreco=function(val){ updateSliderVisual(val); applyFilter(); };

    document.querySelectorAll('.filtro-cat-item').forEach(el=>el.classList.remove('ativo'));
    const qCat=new URLSearchParams(location.search).get('cat');
    if(qCat){ const pre=document.querySelector(`.filtro-cat-item[data-slug="${qCat}"]`); if(pre) pre.classList.add('ativo'); }
    document.querySelectorAll('input[name="desconto"]').forEach(i=>i.addEventListener('change',applyFilter));
    slider?.addEventListener('input',e=>window.atualizarPreco(e.target.value));
    updateSliderVisual(top);
    applyFilter();
  }

  function loadProduct(){
    const nome=document.querySelector('.produto-info h1'); if(!nome) return;
    const produtos=get(K.prod,[]); const id=new URLSearchParams(location.search).get('id');
    const p=produtos.find(x=>x.id===id)||produtos[0]; if(!p) return;
    const code=document.querySelector('.produto-info__codigo'); if(code) code.textContent=`Cód: ${p.codigo}`;
    nome.textContent=p.nome;
  }

  window.toggleFiltro=function(el){ el.classList.toggle('aberto'); const conteudo=el.nextElementSibling; if(conteudo) conteudo.style.display=el.classList.contains('aberto')?'':'none'; };
  window.setView=function(tipo,btn){ document.querySelectorAll('.view-btn').forEach(b=>b.classList.remove('ativo')); if(btn) btn.classList.add('ativo'); const grid=document.getElementById('produtosGrid'); if(grid) grid.style.gridTemplateColumns=tipo==='lista'?'1fr':''; };
  window.selecionarMidia=function(idx){ const lista=window.medias||[]; if(!lista.length) return; window.indiceAtual=idx; const m=lista[idx]; const img=document.getElementById('imgPrincipal'); const vid=document.getElementById('videoPrincipal'); const iframe=document.getElementById('iframeVideo'); const tipo=document.getElementById('galeriaTipo'); if(m.type==='video'){ if(img) img.style.display='none'; if(vid) vid.style.display='block'; if(iframe) iframe.src=m.src; } else { if(vid) vid.style.display='none'; if(iframe) iframe.src=''; if(img){ img.style.display='block'; img.src=m.src; } } if(tipo) tipo.textContent=m.label||''; document.querySelectorAll('.galeria__thumb').forEach((t,i)=>t.classList.toggle('ativo',i===idx)); };
  window.mudarMidia=function(dir){ const lista=window.medias||[]; if(!lista.length) return; let i=(window.indiceAtual||0)+dir; if(i<0) i=lista.length-1; if(i>=lista.length) i=0; window.selecionarMidia(i); };

  boot();
  document.addEventListener('DOMContentLoaded',()=>{ applyConfig(); loadHome(); loadCatalog(); loadProduct(); });
})();

