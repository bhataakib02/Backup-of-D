import { currency } from './main.js';

async function load(limit=10){
  const res = await fetch(`/api/movies/top?limit=${limit}`);
  const movies = await res.json();
  const host = document.getElementById('list');
  host.innerHTML = movies.map((m,i)=>{
    const poster = (m.posterURL && m.posterURL !== 'undefined' && m.posterURL !== 'null') 
      ? m.posterURL 
      : '/assets/poster-default.svg';
    return `
    <a class="card" href="movie.html?id=${m.id||m._id}" style="position:relative;">
      <div style="position:absolute; top:8px; left:8px; z-index:1;" class="chip">#${i+1}</div>
      <img class="thumb" src="${poster}" alt="${m.title || 'Movie'}" loading="lazy" onerror="this.onerror=null; this.src='/assets/poster-default.svg'"/>
      <div class="content">
        <div class="meta"><strong>${m.title || 'Untitled'}</strong><span>${m.year || 'N/A'}</span></div>
        <div class="muted">${currency(m.worldwideGross)}</div>
      </div>
    </a>`;
  }).join('');
}

load(10);
document.getElementById('limit').addEventListener('change', (e)=>load(Number(e.target.value)));


