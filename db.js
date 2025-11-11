import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cheerful_clowns.db');
const schemaPath = path.join(__dirname, 'schema.sql');

export const db = new sqlite3.Database(dbPath);

export function initDb() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error initializing DB:', err);
    } else {
      console.log('Database initialized.');
    }
  });
}
