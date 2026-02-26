const tokenKey = 'adminToken';

const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');

function authHeaders() {
  const t = localStorage.getItem(tokenKey);
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
}

async function login(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const body = await res.json();
  if (!res.ok) {
    document.getElementById('loginMsg').textContent = body.error || 'Login failed';
    return;
  }
  localStorage.setItem(tokenKey, body.token);
  showApp();
}

function showApp() {
  loginView.style.display = 'none'; appView.style.display = 'block';
  refreshMovies(); refreshContacts();
}

async function refreshMovies() {
  const res = await fetch('/api/movies'); const { movies } = await res.json();
  const tableHost = document.getElementById('moviesTable');
  tableHost.innerHTML = `
    <div style="overflow:auto">
    <table>
      <thead><tr><th>Title</th><th>Year</th><th>Gross</th><th></th></tr></thead>
      <tbody>
        ${movies.map(m=>`<tr>
          <td>${m.title}</td>
          <td>${m.year}</td>
          <td>${m.worldwideGross.toLocaleString('en-US')}</td>
          <td class="row"><button class="btn" data-edit="${m.id || m._id}">Edit</button><button class="btn" data-del="${m.id || m._id}">Delete</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  tableHost.querySelectorAll('[data-del]').forEach((btn)=>btn.addEventListener('click', ()=>delMovie(btn.dataset.del)));
  tableHost.querySelectorAll('[data-edit]').forEach((btn)=>btn.addEventListener('click', async ()=>{
    const id = btn.dataset.edit; const res = await fetch(`/api/movies/${id}`); const movie = await res.json();
    openEditor(movie);
  }));
}

async function refreshContacts() {
  // simple display by calling backend DB directly is not implemented; for demo, show message telling stored in DB
  document.getElementById('contactsTable').innerHTML = '<p class="muted">Contact messages are stored in MongoDB. (Endpoint for listing can be added if needed.)</p>';
}

function openEditor(movie={}) {
  const wrap = document.createElement('div');
  wrap.className = 'glass'; wrap.style.cssText = 'padding:12px; margin:12px 0;';
  wrap.innerHTML = `
    <h3>${(movie.id || movie._id) ? 'Edit Movie' : 'New Movie'}</h3>
    <form id="movieForm">
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px,1fr))">
        ${field('title','Title',movie.title)}
        ${field('year','Year',movie.year,'number')}
        ${field('director','Director',movie.director)}
        ${field('genre','Genre',movie.genre)}
        ${field('industry','Industry',movie.industry||'Hollywood')}
        ${field('posterURL','Poster URL',movie.posterURL)}
        ${field('worldwideGross','Worldwide Gross',movie.worldwideGross,'number')}
        ${field('domesticGross','Domestic Gross',movie.domesticGross,'number')}
        ${field('internationalGross','International Gross',movie.internationalGross,'number')}
        ${field('runtimeMinutes','Runtime (min)',movie.runtimeMinutes,'number')}
        ${field('releaseDate','Release Date',movie.releaseDate ? movie.releaseDate.substring(0,10):'','date')}
      </div>
      <div class="field"><label>Description</label><textarea name="description" rows="4">${movie.description||''}</textarea></div>
      <div class="row"><button class="btn" type="submit">Save</button><button class="btn" type="button" id="cancel">Cancel</button></div>
    </form>`;
  appView.prepend(wrap);
  wrap.querySelector('#cancel').addEventListener('click', ()=>wrap.remove());
  wrap.querySelector('#movieForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    ['year','worldwideGross','domesticGross','internationalGross','runtimeMinutes'].forEach(k=>{ if (data[k]!=='' && !isNaN(data[k])) data[k]=Number(data[k]); });
    const movieId = movie.id || movie._id;
    const method = movieId ? 'PUT' : 'POST';
    const url = movieId ? `/api/movies/${movieId}` : '/api/movies';
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(data) });
    if (res.ok) { wrap.remove(); refreshMovies(); } else { alert('Failed to save movie'); }
  });
}

function field(name, label, value='', type='text') {
  return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${value??''}"/></div>`;
}

async function delMovie(id) {
  if (!confirm('Delete movie?')) return;
  const res = await fetch(`/api/movies/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (res.ok) refreshMovies(); else alert('Failed to delete');
}

document.getElementById('loginForm').addEventListener('submit', login);
document.getElementById('newMovie').addEventListener('click', ()=>openEditor({}));
document.getElementById('logout').addEventListener('click', ()=>{ localStorage.removeItem(tokenKey); location.reload(); });

if (localStorage.getItem(tokenKey)) showApp();


