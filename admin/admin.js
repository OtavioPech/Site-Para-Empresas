/*
 * PAINEL ADMIN - admin.js
 * Responsável por:
 * - Autenticação local (protótipo)
 * - CRUD de produtos
 * - CRUD de categorias
 * - Configurações do site
 * Observação: para produção, mover autenticação para backend.
 */

(function(){
  const K={prod:'hs_produtos',cat:'hs_categorias',cfg:'hs_config',cred:'hs_admin_cred',auth:'hs_admin_logado'};
  const get=(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d));
  const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const uid=()=>`id_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const slug=t=>(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const calc=(p,d)=>+(Number(p||0)*(1-Number(d||0)/100)).toFixed(2);

  function seed(){ if(!localStorage.getItem(K.cred)) set(K.cred,{usuario:'admin',senha:'hs2026'}); }
  function isLogged(){ return localStorage.getItem(K.auth)==='1'; }
  function requireAuth(){ if(!isLogged()) location.href='login.html'; }
  function logout(){ localStorage.removeItem(K.auth); location.href='login.html'; }

  function bindLogin(){
    const form=document.getElementById('formLogin'); if(!form) return;
    if(isLogged()) { location.href='dashboard.html'; return; }
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const c=get(K.cred,{usuario:'admin',senha:'hs2026'});
      const u=document.getElementById('usuario').value.trim();
      const p=document.getElementById('senha').value;
      const erro=document.getElementById('erro');
      if(u===c.usuario && p===c.senha){ localStorage.setItem(K.auth,'1'); location.href='dashboard.html'; }
      else if(erro) erro.textContent='Usuário ou senha inválidos.';
    });
  }

  function bindLogoutButtons(){ document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault(); logout();})); }

  function bindDashboard(){
    const box=document.getElementById('kpis'); if(!box) return; requireAuth();
    const prod=get(K.prod,[]), cat=get(K.cat,[]);
    box.innerHTML=`<div class='kpi'><div>Total de produtos</div><strong>${prod.length}</strong></div>
    <div class='kpi'><div>Em destaque</div><strong>${prod.filter(p=>p.destaque).length}</strong></div>
    <div class='kpi'><div>Com desconto</div><strong>${prod.filter(p=>(p.desconto||0)>0).length}</strong></div>
    <div class='kpi'><div>Categorias</div><strong>${cat.length}</strong></div>`;
  }

  function bindProdutos(){
    const tb=document.getElementById('tbProdutos'); if(!tb) return; requireAuth();
    const q=document.getElementById('q'); const ord=document.getElementById('ord');
    const draw=()=>{
      let arr=[...get(K.prod,[])];
      const term=(q?.value||'').toLowerCase();
      if(term) arr=arr.filter(p=>`${p.nome} ${p.codigo}`.toLowerCase().includes(term));
      if(ord?.value==='nome') arr.sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
      if(ord?.value==='preco') arr.sort((a,b)=>(b.precoFinal||b.precoOriginal||0)-(a.precoFinal||a.precoOriginal||0));
      if(ord?.value==='desconto') arr.sort((a,b)=>(b.desconto||0)-(a.desconto||0));
      if(ord?.value==='destaque') arr.sort((a,b)=>(b.destaque?1:0)-(a.destaque?1:0));

      tb.innerHTML=arr.map(p=>`<tr>
      <td><img src='${(p.imagens&&p.imagens[0])||''}' style='width:44px;height:44px;object-fit:cover;border-radius:6px'></td>
      <td>${p.nome}<div class='muted'>${p.codigo}</div></td>
      <td>${(p.categorias||[]).join(', ')}</td>
      <td>${p.precoOriginal||0}</td>
      <td>${p.desconto||0}%</td>
      <td>${p.precoFinal||p.precoOriginal||0}</td>
      <td><input type='checkbox' ${p.destaque?'checked':''} data-toggle='${p.id}'></td>
      <td><a href='produto-form.html?id=${p.id}'>Editar</a> | <a href='#' data-del='${p.id}'>Excluir</a></td>
      </tr>`).join('');

      tb.querySelectorAll('[data-toggle]').forEach(i=>i.addEventListener('change',()=>{
        const id=i.getAttribute('data-toggle'); const list=get(K.prod,[]); const idx=list.findIndex(x=>x.id===id); if(idx<0) return;
        list[idx].destaque=i.checked; set(K.prod,list); draw();
      }));
      tb.querySelectorAll('[data-del]').forEach(a=>a.addEventListener('click',(e)=>{
        e.preventDefault(); const id=a.getAttribute('data-del');
        set(K.prod,get(K.prod,[]).filter(p=>p.id!==id)); draw();
      }));
    };
    q?.addEventListener('input',draw); ord?.addEventListener('change',draw); draw();
  }

  function bindProdutoForm(){
    const form=document.getElementById('formProduto'); if(!form) return; requireAuth();
    const catsWrap=document.getElementById('catsWrap'); const listCats=get(K.cat,[]); const all=get(K.prod,[]);
    const pid=new URLSearchParams(location.search).get('id'); const edit=all.find(p=>p.id===pid);
    const nome=document.getElementById('nome'); const codigo=document.getElementById('codigo'); const descricao=document.getElementById('descricao');
    const precoOriginal=document.getElementById('precoOriginal'); const desconto=document.getElementById('desconto'); const precoFinal=document.getElementById('precoFinal');
    const destaque=document.getElementById('destaque'); const imagemArquivo=document.getElementById('imagemArquivo'); const addImg=document.getElementById('addImg'); const listaImgs=document.getElementById('listaImgs');
    const videoUrl=document.getElementById('videoUrl'); const addVid=document.getElementById('addVid'); const listaVids=document.getElementById('listaVids');
    const excluir=document.getElementById('excluir');

    catsWrap.innerHTML=listCats.map(c=>`<label><input type='checkbox' value='${c.slug}'> ${c.nome}</label>`).join('<br>');
    const imgs=[]; const vids=[];

    const render=()=>{
      listaImgs.innerHTML=imgs.map((x,i)=>`<div style='display:flex;align-items:center;gap:.6rem;margin:.35rem 0'><img src='${x}' style='width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid #ddd'><span>${i===0?'Principal':'Imagem '+(i+1)}</span><a href='#' data-up='${i}'>↑</a><a href='#' data-down='${i}'>↓</a><a href='#' data-ri='${i}'>remover</a></div>`).join('');
      listaVids.innerHTML=vids.map((x,i)=>`<div>${x} <a href='#' data-rv='${i}'>remover</a></div>`).join('');
      listaImgs.querySelectorAll('[data-ri]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();imgs.splice(Number(a.dataset.ri),1);render();}));
      listaImgs.querySelectorAll('[data-up]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();const i=Number(a.dataset.up); if(i>0){[imgs[i-1],imgs[i]]=[imgs[i],imgs[i-1]]; render();}}));
      listaImgs.querySelectorAll('[data-down]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();const i=Number(a.dataset.down); if(i<imgs.length-1){[imgs[i+1],imgs[i]]=[imgs[i],imgs[i+1]]; render();}}));
      listaVids.querySelectorAll('[data-rv]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();vids.splice(Number(a.dataset.rv),1);render();}));
    };

    const recalc=()=>precoFinal.value=calc(precoOriginal.value,desconto.value).toFixed(2);
    if(edit){
      nome.value=edit.nome||''; codigo.value=edit.codigo||''; descricao.value=edit.descricao||'';
      precoOriginal.value=edit.precoOriginal||0; desconto.value=edit.desconto||0; destaque.checked=!!edit.destaque;
      (edit.categorias||[]).forEach(sg=>{const el=catsWrap.querySelector(`input[value='${sg}']`); if(el) el.checked=true;});
      (edit.imagens||[]).forEach(x=>imgs.push(x)); (edit.videos||[]).forEach(x=>vids.push(x));
    } else if(excluir){ excluir.style.display='none'; }
    recalc(); render();

    precoOriginal.addEventListener('input',recalc); desconto.addEventListener('input',recalc);
    addImg?.addEventListener('click',async()=>{
      const file=imagemArquivo?.files?.[0]; if(!file) return;
      const b64=await new Promise(res=>{const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.readAsDataURL(file);});
      imgs.push(b64); imagemArquivo.value=''; render();
    });
    addVid?.addEventListener('click',()=>{if(videoUrl.value.trim()){vids.push(videoUrl.value.trim());videoUrl.value='';render();}});
    excluir?.addEventListener('click',()=>{ if(!edit) return; set(K.prod,all.filter(x=>x.id!==edit.id)); location.href='produtos.html'; });

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const p={
        id:edit?edit.id:uid(),codigo:codigo.value.trim(),nome:nome.value.trim(),descricao:descricao.value.trim(),
        categorias:[...catsWrap.querySelectorAll('input:checked')].map(i=>i.value),
        precoOriginal:Number(precoOriginal.value||0),desconto:Number(desconto.value||0),precoFinal:calc(precoOriginal.value,desconto.value),
        destaque:destaque.checked,imagens:imgs,videos:vids,criadoEm:edit?edit.criadoEm:new Date().toISOString().slice(0,10),ativo:true
      };
      const arr=get(K.prod,[]); const i=arr.findIndex(x=>x.id===p.id); if(i>=0) arr[i]=p; else arr.push(p); set(K.prod,arr); location.href='produtos.html';
    });
  }

  function bindCategorias(){
    const tb=document.getElementById('tbCats'); if(!tb) return; requireAuth();
    const catNome=document.getElementById('catNome'); const catSlug=document.getElementById('catSlug'); const catEmoji=document.getElementById('catEmoji');
    const catDescricao=document.getElementById('catDescricao'); const catId=document.getElementById('catId'); const title=document.getElementById('catFormTitle');
    const salvar=document.getElementById('salvarCat'); const limpar=document.getElementById('limparCat');

    const resetForm=()=>{catId.value=''; catNome.value=''; catSlug.value=''; catEmoji.value=''; catDescricao.value=''; title.textContent='Nova categoria';};
    catNome?.addEventListener('input',()=>{ if(!catId.value) catSlug.value=slug(catNome.value); });

    const draw=()=>{
      const cats=get(K.cat,[]), prods=get(K.prod,[]);
      tb.innerHTML=cats.map(c=>`<tr><td>${c.nome}</td><td>${c.slug}</td><td>${c.emoji||''}</td><td>${c.descricao||''}</td><td>${prods.filter(p=>(p.categorias||[]).includes(c.slug)).length}</td><td><a href='#' data-ed='${c.id}'>Editar</a> | <a href='#' data-rm='${c.id}'>Excluir</a></td></tr>`).join('');

      tb.querySelectorAll('[data-ed]').forEach(a=>a.addEventListener('click',(e)=>{
        e.preventDefault(); const id=a.dataset.ed; const c=get(K.cat,[]).find(x=>x.id===id); if(!c) return;
        catId.value=c.id; catNome.value=c.nome||''; catSlug.value=c.slug||''; catEmoji.value=c.emoji||''; catDescricao.value=c.descricao||''; title.textContent='Editar categoria';
      }));

      tb.querySelectorAll('[data-rm]').forEach(a=>a.addEventListener('click',(e)=>{
        e.preventDefault(); const id=a.dataset.rm; const cats=get(K.cat,[]); const cat=cats.find(c=>c.id===id); const prods=get(K.prod,[]);
        if(cat&&prods.some(p=>(p.categorias||[]).includes(cat.slug))) return;
        set(K.cat,cats.filter(c=>c.id!==id)); draw(); resetForm();
      }));
    };

    salvar?.addEventListener('click',()=>{
      const nome=(catNome.value||'').trim(); if(!nome) return;
      const sg=(catSlug.value||slug(nome)).trim();
      const cats=get(K.cat,[]);
      if(catId.value){
        const i=cats.findIndex(c=>c.id===catId.value); if(i<0) return;
        cats[i]={...cats[i],nome,slug:sg,emoji:(catEmoji.value||'').trim(),descricao:(catDescricao.value||'').trim()};
      } else {
        cats.push({id:uid(),nome,slug:sg,emoji:(catEmoji.value||'').trim(),descricao:(catDescricao.value||'').trim(),ordem:cats.length+1});
      }
      set(K.cat,cats); draw(); resetForm();
    });

    limpar?.addEventListener('click',resetForm);
    draw();
  }

  function bindConfig(){
    const form=document.getElementById('formConfig'); if(!form) return; requireAuth();
    const c=get(K.cfg,{}), cred=get(K.cred,{usuario:'admin',senha:'hs2026'});
    const nomeEmpresa=document.getElementById('nomeEmpresa'); const descricaoEmpresa=document.getElementById('descricaoEmpresa');
    const whatsapp=document.getElementById('whatsapp'); const versiculo=document.getElementById('versiculo');
    const corPrimaria=document.getElementById('corPrimaria'); const corDestaque=document.getElementById('corDestaque'); const corEscura=document.getElementById('corEscura');
    const usuario=document.getElementById('usuario'); const novaSenha=document.getElementById('novaSenha'); const confirmarSenha=document.getElementById('confirmarSenha'); const msg=document.getElementById('msg');
    nomeEmpresa.value=c.nomeEmpresa||''; descricaoEmpresa.value=c.descricaoEmpresa||''; whatsapp.value=c.whatsapp||''; versiculo.value=c.versiculo||'';
    corPrimaria.value=c.corPrimaria||'#1B3A6B'; corDestaque.value=c.corDestaque||'#E8A020'; corEscura.value=c.corEscura||'#0D1F3C'; usuario.value=cred.usuario;
    [corPrimaria,corDestaque,corEscura].forEach(el=>el.addEventListener('input',()=>document.documentElement.style.setProperty(el===corPrimaria?'--cor-primaria':el===corDestaque?'--cor-destaque':'--cor-escura',el.value)));

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      set(K.cfg,{...c,nomeEmpresa:nomeEmpresa.value.trim(),descricaoEmpresa:descricaoEmpresa.value.trim(),whatsapp:whatsapp.value.trim(),versiculo:versiculo.value.trim(),corPrimaria:corPrimaria.value,corDestaque:corDestaque.value,corEscura:corEscura.value});
      if(novaSenha.value){ if(novaSenha.value!==confirmarSenha.value){ return; } set(K.cred,{usuario:usuario.value.trim()||'admin',senha:novaSenha.value}); }
      else { set(K.cred,{...cred,usuario:usuario.value.trim()||cred.usuario}); }
      if(msg) msg.textContent='✅ Configurações salvas com sucesso!';
    });
  }

  seed();
  document.addEventListener('DOMContentLoaded',()=>{ bindLogin(); bindLogoutButtons(); bindDashboard(); bindProdutos(); bindProdutoForm(); bindCategorias(); bindConfig(); });
})();


