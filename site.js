(function(){
  const KEYS={prod:'hs_produtos',cat:'hs_categorias',cfg:'hs_config'};
  const defaults={
    categorias:[
      {id:'cat1',nome:'Kits Case',slug:'case',emoji:'🔴',descricao:'Case',ordem:1},
      {id:'cat2',nome:'Kits John Deere',slug:'john-deere',emoji:'🟢',descricao:'John Deere',ordem:2},
      {id:'cat3',nome:'Kits New Holland',slug:'new-holland',emoji:'🟡',descricao:'New Holland',ordem:3},
      {id:'cat4',nome:'Massey Ferguson',slug:'massey',emoji:'🟤',descricao:'Massey',ordem:4},
      {id:'cat5',nome:'Peças e Sensores',slug:'pecas',emoji:'⚙️',descricao:'Peças',ordem:5}
    ],
    produtos:[
      {id:'prod_5161',codigo:'5161',nome:'Kit Plataforma de Milho — Case',descricao:'Equipamento para controle preciso da plataforma.',categorias:['case'],precoOriginal:2000,desconto:15,precoFinal:1700,destaque:true,imagens:['https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=900'],videos:[],criadoEm:'2026-01-15',ativo:true},
      {id:'prod_5169',codigo:'5169',nome:'Kit Plataforma de Soja — John Deere',descricao:'Solução para colheita de soja.',categorias:['john-deere'],precoOriginal:2350,desconto:10,precoFinal:2115,destaque:true,imagens:['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=900'],videos:[],criadoEm:'2026-02-20',ativo:true},
      {id:'prod_5190',codigo:'5190',nome:'Controlador Eletrônico de Plataforma',descricao:'Controlador para plataformas diversas.',categorias:['pecas'],precoOriginal:0,desconto:0,precoFinal:0,destaque:false,imagens:['https://images.unsplash.com/photo-1518770660439-4636190af475?w=900'],videos:[],criadoEm:'2026-03-01',ativo:true},
      {id:'prod_5165',codigo:'5165',nome:'Kit Alteração do Módulo — Case',descricao:'Alteração de módulo para linha Case.',categorias:['case'],precoOriginal:4200,desconto:20,precoFinal:3360,destaque:false,imagens:['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900'],videos:['https://www.youtube.com/embed/dQw4w9WgXcQ'],criadoEm:'2026-03-12',ativo:true}
    ]
  };

  function get(k,d){return JSON.parse(localStorage.getItem(k)||JSON.stringify(d));}
  function set(k,v){localStorage.setItem(k,JSON.stringify(v));}
  function money(v){return v>0?v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'Consulte o preço';}
  function calcFinal(p,d){return +(p*(1-d/100)).toFixed(2);}

  function bootstrap(){
    if(!localStorage.getItem(KEYS.cat)) set(KEYS.cat,defaults.categorias);
    if(!localStorage.getItem(KEYS.prod)) set(KEYS.prod,defaults.produtos);
    if(!localStorage.getItem(KEYS.cfg)) set(KEYS.cfg,{nomeEmpresa:'HS Sistemas Agrícolas',descricaoEmpresa:'Soluções em tecnologia para o campo.',whatsapp:'5545999999999',versiculo:'Pv. 16:3',corPrimaria:'#1B3A6B',corDestaque:'#E8A020',corEscura:'#0D1F3C'});
  }

  function applyConfig(){
    const c=get(KEYS.cfg,{}),r=document.documentElement;
    if(c.corPrimaria)r.style.setProperty('--cor-primaria',c.corPrimaria);
    if(c.corDestaque)r.style.setProperty('--cor-destaque',c.corDestaque);
    if(c.corEscura)r.style.setProperty('--cor-escura',c.corEscura);
    document.querySelectorAll('[data-empresa]').forEach(el=>el.textContent=c.nomeEmpresa||'HS Sistemas Agrícolas');
    document.querySelectorAll('[data-descricao-empresa]').forEach(el=>el.textContent=c.descricaoEmpresa||'Soluções em tecnologia para o campo.');
    document.querySelectorAll('[data-versiculo]').forEach(el=>el.textContent=c.versiculo||'Pv. 16:3');
    document.querySelectorAll('[data-whatsapp-link]').forEach(a=>{
      const text=a.getAttribute('data-wa-text')||'Olá! Gostaria de mais informações.';
      a.href=`https://wa.me/${c.whatsapp||'5545999999999'}?text=${encodeURIComponent(text)}`;
    });
  }

  function productCard(p){
    const desconto=p.desconto>0?`<span class='badge badge--desconto'>-${p.desconto}%</span>`:'';
    const destaque=p.destaque?`<span class='badge'>Destaque</span>`:'';
    const orig=p.desconto>0?`<span class='preco-original'>${money(p.precoOriginal)}</span>`:'';
    const atual=`<span class='preco-atual ${p.desconto>0?'com-desconto':''}'>${money(p.precoFinal||p.precoOriginal)}</span>`;
    return `<a class='produto-card' href='produto.html?id=${p.id}'><img src='${(p.imagens&&p.imagens[0])||''}' alt='${p.nome}'><div class='produto-card__corpo'><div>${destaque} ${desconto}</div><span class='mini'>Cód: ${p.codigo}</span><h3 class='produto-card__nome'>${p.nome}</h3><span class='mini'>${(p.categorias||[]).join(' · ')}</span><div>${orig} ${atual}</div></div></a>`;
  }

  function loadHome(){
    const grid=document.getElementById('homeDestaques'); if(!grid) return;
    const produtos=get(KEYS.prod,[]).filter(p=>p.ativo);
    const a=produtos.filter(p=>p.destaque).sort((x,y)=>y.desconto-x.desconto);
    const b=produtos.filter(p=>!p.destaque&&p.desconto>0).sort((x,y)=>y.desconto-x.desconto);
    const c=produtos.filter(p=>!p.destaque&&p.desconto===0).sort((x,y)=>new Date(y.criadoEm)-new Date(x.criadoEm));
    const show=[...a,...b,...c].slice(0,8);
    grid.innerHTML=show.map(productCard).join('');
  }

  function loadCatalog(){
    const grid=document.getElementById('catalogoGrid'); if(!grid) return;
    const search=document.getElementById('busca'); const order=document.getElementById('ordenacao'); const catWrap=document.getElementById('cats'); const count=document.getElementById('count');
    const produtos=get(KEYS.prod,[]).filter(p=>p.ativo); const cats=get(KEYS.cat,[]);
    const q=new URLSearchParams(location.search); const pre=q.get('cat');
    catWrap.innerHTML=cats.map(c=>`<label><input type='checkbox' value='${c.slug}' ${pre===c.slug?'checked':''}> ${c.emoji} ${c.nome}</label>`).join('<br>');
    function draw(){
      let arr=[...produtos]; const txt=(search.value||'').toLowerCase();
      const checked=[...catWrap.querySelectorAll("input:checked")].map(i=>i.value);
      if(txt) arr=arr.filter(p=>`${p.nome} ${p.codigo}`.toLowerCase().includes(txt));
      if(checked.length) arr=arr.filter(p=>(p.categorias||[]).some(c=>checked.includes(c)));
      if(order.value==='menor-preco') arr.sort((a,b)=>(a.precoFinal||a.precoOriginal)-(b.precoFinal||b.precoOriginal));
      if(order.value==='maior-preco') arr.sort((a,b)=>(b.precoFinal||b.precoOriginal)-(a.precoFinal||a.precoOriginal));
      if(order.value==='maior-desconto') arr.sort((a,b)=>b.desconto-a.desconto);
      if(order.value==='nome-az') arr.sort((a,b)=>a.nome.localeCompare(b.nome));
      grid.innerHTML=arr.map(productCard).join(''); count.textContent=arr.length;
    }
    [search,order,catWrap].forEach(el=>el.addEventListener('input',draw)); draw();
  }

  function loadProduct(){
    const box=document.getElementById('produtoDetalhe'); if(!box) return;
    const produtos=get(KEYS.prod,[]); const id=new URLSearchParams(location.search).get('id');
    const p=produtos.find(x=>x.id===id)||produtos[0]; if(!p) return;
    document.getElementById('pNome').textContent=p.nome;
    document.getElementById('pCodigo').textContent=`Cód: ${p.codigo}`;
    document.getElementById('pDesc').textContent=p.descricao||'';
    document.getElementById('pImagem').src=(p.imagens&&p.imagens[0])||'';
    document.getElementById('pPreco').textContent=money(p.precoFinal||p.precoOriginal);
    document.getElementById('pPrecoOriginal').textContent=p.desconto>0?money(p.precoOriginal):'';
    document.getElementById('pCategorias').textContent=(p.categorias||[]).join(' · ');
    const rel=document.getElementById('relacionados');
    if(rel){rel.innerHTML=produtos.filter(x=>x.id!==p.id).slice(0,4).map(productCard).join('');}
  }

  bootstrap();
  window.hsSite={get,set,calcFinal,applyConfig};
  document.addEventListener('DOMContentLoaded',()=>{applyConfig();loadHome();loadCatalog();loadProduct();});
})();

