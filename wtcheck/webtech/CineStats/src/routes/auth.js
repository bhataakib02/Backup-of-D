import { Router } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/lowdb.js';

const router = Router();

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(128).required(),
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    await db.read();
    const admin = db.data.admins.find(a=>a.username===value.username);
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = bcrypt.compareSync(value.password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.username, username: admin.username },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '8h' }
    );
    return res.json({ token, username: admin.username });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;


