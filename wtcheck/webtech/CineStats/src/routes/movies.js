import { Router } from 'express';
import Joi from 'joi';
import { nanoid } from 'nanoid';
import { db } from '../db/lowdb.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

const movieSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  year: Joi.number().integer().min(1888).required(),
  director: Joi.string().min(1).max(100).required(),
  genre: Joi.string().min(1).max(100).required(),
  industry: Joi.string().valid('Hollywood','Bollywood').default('Hollywood'),
  worldwideGross: Joi.number().min(0).required(),
  domesticGross: Joi.number().min(0).optional(),
  internationalGross: Joi.number().min(0).optional(),
  runtimeMinutes: Joi.number().min(0).optional(),
  releaseDate: Joi.date().optional(),
  posterURL: Joi.string().uri().required(),
  description: Joi.string().allow('').optional(),
});

// GET /api/movies?search=&sort=year|gross|alpha&order=asc|desc&limit=&skip=
router.get('/', async (req, res) => {
  try {
    const { search = '', sort = 'gross', order = 'desc', limit, skip, industry, genre } = req.query;
    await db.read();
    let movies = db.data.movies.slice();
    if (search) {
      const s = String(search).toLowerCase();
      movies = movies.filter(m => m.title.toLowerCase().includes(s) || m.director.toLowerCase().includes(s) || m.genre.toLowerCase().includes(s) || String(m.year) === s);
    }
    if (industry) {
      movies = movies.filter(m => (m.industry||'Hollywood').toLowerCase() === String(industry).toLowerCase());
    }
    if (genre) {
      const g = String(genre).toLowerCase();
      movies = movies.filter(m => m.genre.toLowerCase() === g);
    }
    movies.sort((a,b)=>{
      if (sort==='year') return (a.year-b.year)*(order==='asc'?1:-1);
      if (sort==='alpha') return a.title.localeCompare(b.title)*(order==='asc'?1:-1);
      return (a.worldwideGross-b.worldwideGross)*(order==='asc'?1:-1);
    });
    const total = movies.length;
    const start = skip ? Number(skip) : 0;
    const end = limit ? start + Number(limit) : undefined;
    return res.json({ total, movies: movies.slice(start, end) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.get('/top10', async (_req, res) => {
  try {
    await db.read();
    const movies = db.data.movies.slice().sort((a,b)=>b.worldwideGross-a.worldwideGross).slice(0,10);
    return res.json(movies);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch top 10' });
  }
});

router.get('/top', async (req, res) => {
  try {
    const limit = Math.min(1000, Math.max(1, Number(req.query.limit) || 10));
    await db.read();
    const movies = db.data.movies.slice().sort((a,b)=>b.worldwideGross-a.worldwideGross).slice(0, limit);
    return res.json(movies);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await db.read();
    const movie = db.data.movies.find(m=>m.id===req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    const reviews = db.data.reviews.filter(r=>r.movieId===req.params.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
    return res.json({ ...movie, reviews });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { error, value } = movieSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const id = nanoid();
    await db.read();
    db.data.movies.push({ id, ...value });
    await db.write();
    return res.status(201).json(db.data.movies.find(m=>m.id===id));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add movie' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { error, value } = movieSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    await db.read();
    const idx = db.data.movies.findIndex(m=>m.id===req.params.id);
    if (idx<0) return res.status(404).json({ error: 'Movie not found' });
    db.data.movies[idx] = { id: req.params.id, ...value };
    await db.write();
    return res.json(db.data.movies[idx]);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.read();
    const before = db.data.movies.length;
    db.data.movies = db.data.movies.filter(m=>m.id!==req.params.id);
    db.data.reviews = db.data.reviews.filter(r=>r.movieId!==req.params.id);
    if (db.data.movies.length === before) return res.status(404).json({ error: 'Movie not found' });
    await db.write();
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
});

export default router;


