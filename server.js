import express from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'waitlist.db'));

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// Join waitlist
app.post('/api/waitlist', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    const stmt = db.prepare('INSERT INTO waitlist (email) VALUES (?)');
    stmt.run(email.trim().toLowerCase());
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.json({ success: true }); // Already signed up
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to join waitlist' });
  }
});

// Export as CSV (for downloading)
app.get('/api/waitlist/export', (req, res) => {
  const rows = db.prepare('SELECT email, created_at FROM waitlist ORDER BY created_at').all();
  const csv = ['email,created_at', ...rows.map(r => `"${r.email}","${r.created_at}"`)].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
  res.send(csv);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
