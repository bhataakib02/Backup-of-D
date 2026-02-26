import { Router } from 'express';
import Joi from 'joi';
import { db } from '../db/lowdb.js';

const router = Router();

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(5).max(1000).required(),
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    await db.read();
    const id = (db.data.contacts.at(-1)?.id || 0) + 1;
    db.data.contacts.push({ id, ...value, date: new Date().toISOString() });
    await db.write();
    return res.status(201).json({ id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;


