import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';

const dbFile = process.env.DB_PATH || path.resolve('cinestats.json');
const adapter = new JSONFile(dbFile);
export const db = new Low(adapter, { movies: [], reviews: [], contacts: [], admins: [] });

export async function initDb() {
  if (!fs.existsSync(path.dirname(dbFile))) {
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  }
  await db.read();
  db.data ||= { movies: [], reviews: [], contacts: [], admins: [] };
  await db.write();
}


