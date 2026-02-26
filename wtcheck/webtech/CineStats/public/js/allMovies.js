import { currency, qs } from './main.js';

const state = { page: 1, perPage: 10, items: [], filtered: [] };

function render() {
  const start = (state.page - 1) * state.perPage;
  const pageItems = state.filtered.slice(start, start + state.perPage);
  const host = document.getElementById('movies');
  host.innerHTML = pageItems.map(m=>{
    const poster = (m.posterURL && m.posterURL !== 'undefined' && m.posterURL !== 'null') 
      ? m.posterURL 
      : '/assets/poster-default.svg';
    return `
    <a class="card" href="movie.html?id=${m.id || m._id}">
      <img class="thumb" src="${poster}" alt="${m.title || 'Movie'}" loading="lazy" onerror="this.onerror=null; this.src='/assets/poster-default.svg'"/>
      <div class="content">
        <div class="meta"><strong>${m.title || 'Untitled'}</strong><span>${m.year || 'N/A'}</span></div>
        <div class="muted">${currency(m.worldwideGross)}</div>
      </div>
    </a>`;
  }).join('');

  const pages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
  const pager = document.getElementById('pager');
  pager.innerHTML = Array.from({length: pages}).map((_,i)=>{
    const p = i+1; const active = p===state.page? 'active':'';
    return `<button class="page-btn ${active}" data-page="${p}">${p}</button>`;
  }).join('');
  pager.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
    state.page = Number(btn.dataset.page); render();
  }));
}

function applyFilters() {
  const term = qs('#search').value.trim().toLowerCase();
  const industry = qs('#industry').value;
  const sort = qs('#sort').value; const order = qs('#order').value;
  let arr = [...state.items];
  if (term) {
    arr = arr.filter(m => (
      m.title.toLowerCase().includes(term) ||
      m.director.toLowerCase().includes(term) ||
      m.genre.toLowerCase().includes(term) ||
      String(m.year) === term
    ));
  }
  if (industry) {
    arr = arr.filter(m => (m.industry||'Hollywood') === industry);
  }
  const dir = order === 'asc' ? 1 : -1;
  arr.sort((a,b)=>{
    if (sort==='year') return (a.year-b.year)*dir;
    if (sort==='alpha') return a.title.localeCompare(b.title)*dir;
    return (a.worldwideGross-b.worldwideGross)*dir;
  });
  state.filtered = arr;
  state.page = 1;
  render();
}

fetch('/api/movies')
  .then(r=>r.json())
  .then(({movies})=>{ state.items = movies; state.filtered = movies; render(); })
  .catch(()=>{});

['#search','#industry','#sort','#order'].forEach(sel=>qs(sel).addEventListener('input', applyFilters));


