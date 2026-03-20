import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function getSql() {
  const conn =
    process.env.POSTGRES_URL ||
    process.env.storage_POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.storage_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;
  return conn ? neon(conn) : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const sql = getSql();
  if (!sql) return res.status(500).json({ error: 'Database not configured' });

  try {
    const { email } = req.body as { email?: string };
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    const normalized = email.trim().toLowerCase();

    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`INSERT INTO waitlist (email) VALUES (${normalized})`;
    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e?.code === '23505') {
      return res.status(200).json({ success: true });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to join waitlist' });
  }
}
