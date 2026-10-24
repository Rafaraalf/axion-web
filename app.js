import {CONFIG} from './config.js';
import {DEMO_ITEMS} from './demo-data.js';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'axion-web-demo-v1';
let tab = 'pending';
let query = '';
let category = 'all';
let items = structuredClone(DEMO_ITEMS);
let operations = loadOperations();

function loadOperations(){
  try { const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); return v && typeof v==='object' && !Array.isArray(v) ? v : {}; }
  catch { return {}; }
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(operations));}
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2500);}
function status(id){return operations[id]?.status || 'pending';}
function sumFor(s){return items.filter(x=>status(x.id)===s).reduce((total,x)=>total+x.quantidade,0);}
function setTab(next){tab=next;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));$('pageTitle').textContent=tab==='pending'?'Abastecimento':tab==='history'?'Histórico':'Itens sem estoque';$('listTitle').textContent=tab==='pending'?'Lista de abastecimento':tab==='history'?'Operações registradas':'Produtos sinalizados S/E';render();}
function setStatus(id,next){
  if(!items.some(x=>x.id===id))return;
  if(next==='pending')delete operations[id];
  else operations[id]={status:next,at:new Date().toISOString()};
  save();render();toast(next==='pending'?'Ação desfeita (demonstração)':next==='done'?'Abastecimento confirmado (demonstração)':'Item marcado S/E (demonstração)');
}
function filtered(){return items.filter(x=>{
  const s=status(x.id);
  const matchesTab=tab==='pending'?s==='pending':tab==='no-stock'?s==='no-stock':s!=='pending';
  const matchesCategory=category==='all'||x.categoria===category;
  const searchable=[x.marca,x.descricao,x.referencia,x.cor,x.tamanho,x.loja,x.posicao].join(' ').toLocaleLowerCase('pt-BR');
  return matchesTab&&matchesCategory&&searchable.includes(query);
});}
function render(){
  $('pendingCount').textContent=sumFor('pending');$('doneCount').textContent=sumFor('done');$('noStockCount').textContent=sumFor('no-stock');
  const shown=filtered();$('itemCount').textContent=`${shown.length} ${shown.length===1?'item':'itens'}`;
  $('list').innerHTML=shown.length?shown.map(x=>{
    const s=status(x.id);
    const buttons=s==='pending'?`<button class="ok" data-id="${escapeHTML(x.id)}" data-action="done">✓ OK</button><button class="se" data-id="${escapeHTML(x.id)}" data-action="no-stock">S/E</button>`:`<button class="undo" data-id="${escapeHTML(x.id)}" data-action="pending">↶ Desfazer</button>`;
    const at=operations[x.id]?.at;
    return `<article class="item"><div class="item-info"><h3>${escapeHTML(x.descricao)}</h3><div class="meta">${escapeHTML(x.marca)} · REF ${escapeHTML(x.referencia)} · ${escapeHTML(x.cor)} · ${escapeHTML(x.tamanho)}<br>${escapeHTML(x.loja)}${at?` · ${escapeHTML(new Date(at).toLocaleString('pt-BR'))}`:''}</div><span class="position">⌖ ${escapeHTML(x.posicao||'Não localizado')}</span></div><div class="quantity"><strong>${x.quantidade}</strong><small>un.</small></div><div class="actions">${buttons}</div></article>`;
  }).join(''):'<div class="empty">Nenhum item encontrado nesta lista.</div>';
}
function init(){
  if(CONFIG.mode!=='demo'){toast('Modo de API ainda não implementado.');return;}
  const categories=[...new Set(items.map(x=>x.categoria))].sort();
  $('category').insertAdjacentHTML('beforeend',categories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join(''));
  $('search').addEventListener('input',e=>{query=e.target.value.toLocaleLowerCase('pt-BR').trim();render();});
  $('category').addEventListener('change',e=>{category=e.target.value;render();});
  document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
  $('list').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b)setStatus(b.dataset.id,b.dataset.action);});
  $('refreshBtn').addEventListener('click',()=>{render();toast('Dados de demonstração atualizados');});
  render();
}
init();
