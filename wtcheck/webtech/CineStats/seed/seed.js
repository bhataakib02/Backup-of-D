import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { db, initDb } from '../src/db/lowdb.js';
import { nanoid } from 'nanoid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  await initDb();
  const moviesPath = path.join(__dirname, '../data/movies.json');
  const raw = fs.readFileSync(moviesPath, 'utf-8');
  const sampleMovies = JSON.parse(raw);

  await db.read();
  db.data.movies = [];
  db.data.reviews = [];
  for (const m of sampleMovies) {
    const id = nanoid();
    const { reviews = [], ...rest } = m;
    db.data.movies.push({ id, industry: rest.industry || 'Hollywood', ...rest });
    for (const r of reviews) db.data.reviews.push({ movieId: id, ...r });
  }

  // Generate additional movies to reach at least 100 items (mix Hollywood/Bollywood)
  const need = Math.max(0, 100 - db.data.movies.length);
  const genres = ['Action','Drama','Comedy','Sci-Fi','Adventure','Thriller','Romance'];
  const directorsH = ['John Doe','Jane Smith','Alex Johnson','Chris Lee'];
  const directorsB = ['Raj Kumar','Anita Verma','Vikram Singh','Neha Gupta'];
  for (let i = 0; i < need; i++) {
    const isBollywood = i % 2 === 1;
    const title = isBollywood ? `Bollywood Hit ${i+1}` : `Hollywood Blockbuster ${i+1}`;
    const year = 1980 + Math.floor(Math.random()*45);
    const genre = genres[i % genres.length];
    const director = isBollywood ? directorsB[i % directorsB.length] : directorsH[i % directorsH.length];
    const worldwideGross = 100000000 + Math.floor(Math.random()*2500000000);
    const domesticGross = Math.floor(worldwideGross * (isBollywood ? 0.35 : 0.45));
    const internationalGross = worldwideGross - domesticGross;
    const posterURL = `https://via.placeholder.com/300x400?text=${encodeURIComponent(title)}`;
    const id = nanoid();
    db.data.movies.push({ id, title, year, director, genre, industry: isBollywood ? 'Bollywood':'Hollywood', worldwideGross, domesticGross, internationalGross, runtimeMinutes: 120, releaseDate: `${year}-01-01T00:00:00.000Z`, posterURL, description: `${title} (${genre}) released in ${year}.` });
  }

  const adminUsername = process.env.SEED_ADMIN_USER || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASS || 'admin123';
  db.data.admins = db.data.admins || [];
  if (!db.data.admins.find(a=>a.username===adminUsername)) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    db.data.admins.push({ username: adminUsername, passwordHash });
  }
  await db.write();

  // eslint-disable-next-line no-console
  console.log('Seed completed (Lowdb). Movies inserted and admin ensured.');
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


