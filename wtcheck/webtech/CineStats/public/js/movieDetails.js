import { currency } from './main.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
if (!id) location.replace('all-movies.html');

fetch(`/api/movies/${id}`).then(r=>r.json()).then((m)=>{
  const host = document.getElementById('details');
  const poster = (m.posterURL && m.posterURL !== 'undefined' && m.posterURL !== 'null') 
    ? m.posterURL 
    : '/assets/poster-default.svg';
  host.innerHTML = `
    <div class="row" style="align-items:flex-start">
      <img src="${poster}" alt="${m.title || 'Movie'}" style="width:220px; border-radius:12px; border:1px solid var(--border)" onerror="this.onerror=null; this.src='/assets/poster-default.svg'"/>
      <div style="flex:1">
        <h2 style="margin:0 0 6px">${m.title}</h2>
        <div class="row muted">
          <span class="chip">${m.genre}</span>
          <span class="chip">${m.year}</span>
          <span class="chip">Dir. ${m.director}</span>
          <span class="chip">${m.runtimeMinutes||0} min</span>
        </div>
        <div class="space"></div>
        <p class="muted">${m.description||''}</p>
        <div class="row">
          <div class="chip">Worldwide: <strong>${currency(m.worldwideGross)}</strong></div>
          <div class="chip">Domestic: <strong>${currency(m.domesticGross)}</strong></div>
          <div class="chip">International: <strong>${currency(m.internationalGross)}</strong></div>
        </div>
      </div>
    </div>`;

  const ctx = document.getElementById('chart');
  // eslint-disable-next-line no-undef
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Domestic', 'International'],
      datasets: [{ data: [m.domesticGross||0, m.internationalGross||0], backgroundColor: ['#60a5fa', '#a78bfa'] }]
    },
    options: { plugins: { legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text') } } } }
  });

  const reviews = document.getElementById('reviews');
  reviews.innerHTML = (m.reviews||[]).map(r=>`
    <div class="glass" style="padding:10px; margin-bottom:10px">
      <div class="meta"><strong>${r.user||'Anonymous'}</strong><span class="muted">${new Date(r.date).toLocaleDateString()}</span></div>
      <div class="muted">Rating: ${r.rating??'-'}/10</div>
      <p>${r.comment||''}</p>
    </div>`).join('') || '<p class="muted">No reviews yet.</p>';

  const favBtn = document.getElementById('fav');
  const key = 'favorites';
  const favs = new Set(JSON.parse(localStorage.getItem(key)||'[]'));
  const movieId = m.id || m._id;
  const isFav = favs.has(movieId);
  favBtn.textContent = isFav ? 'Remove Favorite' : 'Add to Favorites';
  favBtn.addEventListener('click', ()=>{
    if (favs.has(movieId)) favs.delete(movieId); else favs.add(movieId);
    localStorage.setItem(key, JSON.stringify(Array.from(favs)));
    favBtn.textContent = favs.has(movieId) ? 'Remove Favorite' : 'Add to Favorites';
  });
}).catch(()=>location.replace('all-movies.html'));


