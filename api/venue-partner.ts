import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const conn = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const sql = conn ? neon(conn) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!sql) return res.status(500).json({ error: 'Database not configured' });

  try {
    const body = req.body as {
      barName?: string;
      firstName?: string;
      lastName?: string;
      workEmail?: string;
    };
    const { barName, firstName, lastName, workEmail } = body;
    if (!barName?.trim() || !firstName?.trim() || !lastName?.trim() || !workEmail?.trim() || !workEmail.includes('@')) {
      return res.status(400).json({ error: 'All fields required' });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS venue_partners (
        id SERIAL PRIMARY KEY,
        bar_name TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        work_email TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO venue_partners (bar_name, first_name, last_name, work_email)
      VALUES (${barName.trim()}, ${firstName.trim()}, ${lastName.trim()}, ${workEmail.trim().toLowerCase()})
    `;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit request' });
  }
}
