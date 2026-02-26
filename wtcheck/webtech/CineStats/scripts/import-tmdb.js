import 'dotenv/config';
import { db, initDb } from '../src/db/lowdb.js';

const TMDB_KEY = process.env.TMDB_API_KEY;
if (!TMDB_KEY) {
  console.error('Missing TMDB_API_KEY in .env');
  process.exit(1);
}

const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';

async function tmdb(path) {
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

async function getDirector(credits) {
  const crew = credits?.crew || [];
  const dir = crew.find(c => c.job === 'Director');
  return dir?.name || '';
}

function toIndustry(movie) {
  const lang = (movie.original_language || '').toLowerCase();
  const countries = (movie.origin_country || []).map(c=>c.toUpperCase());
  return lang === 'hi' || countries.includes('IN') ? 'Bollywood' : 'Hollywood';
}

function toGenre(movie) {
  const names = (movie.genres || []).map(g=>g.name);
  return names[0] || 'Drama';
}

function toReleaseDate(movie) {
  return movie.release_date ? `${movie.release_date}T00:00:00.000Z` : undefined;
}

async function importTopRevenue({ pages = 5 } = {}) {
  await initDb();
  await db.read();
  const acc = [];
  for (let p = 1; p <= pages; p++) {
    const d = await tmdb(`/discover/movie?sort_by=revenue.desc&page=${p}`);
    acc.push(...d.results);
  }
  // Fetch full details/credits for top ~100
  const top = acc.slice(0, pages * 20);
  const details = [];
  for (const m of top) {
    const det = await tmdb(`/movie/${m.id}?append_to_response=credits`);
    details.push(det);
  }

  // Merge into DB
  const byTitle = new Set(db.data.movies.map(m=>m.title));
  for (const m of details) {
    const title = m.title || m.original_title;
    if (!title || byTitle.has(title)) continue;
    const director = await getDirector(m.credits);
    const industry = toIndustry(m);
    const genre = toGenre(m);
    const posterURL = m.poster_path ? `${IMG}${m.poster_path}` : `https://via.placeholder.com/300x400?text=${encodeURIComponent(title)}`;
    const worldwideGross = m.revenue || 0;
    const domesticGross = Math.floor(worldwideGross * (industry === 'Bollywood' ? 0.35 : 0.45));
    const internationalGross = Math.max(0, worldwideGross - domesticGross);
    db.data.movies.push({
      id: `${m.id}`,
      title,
      year: Number((m.release_date||'').slice(0,4)) || 0,
      director,
      genre,
      industry,
      worldwideGross,
      domesticGross,
      internationalGross,
      runtimeMinutes: m.runtime || 0,
      releaseDate: toReleaseDate(m),
      posterURL,
      description: m.overview || ''
    });
    byTitle.add(title);
  }
  await db.write();
  console.log(`Imported ${details.length} movies from TMDB`);
}

importTopRevenue({ pages: Number(process.env.TMDB_PAGES||5) }).catch((e)=>{
  console.error(e);
  process.exit(1);
});


