import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
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

const ADMIN_EMAIL = 'admin@backdoorpass.app';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const from = process.env.RESEND_FROM || 'Backdoor <notifications@backdoorpass.app>';
      const { error } = await resend.emails.send({
        from,
        to: [ADMIN_EMAIL],
        replyTo: workEmail.trim(),
        subject: `Demo request: ${barName.trim()}`,
        html: `
          <p><strong>New venue partner demo request</strong></p>
          <table>
            <tr><td>Bar name</td><td>${escapeHtml(barName.trim())}</td></tr>
            <tr><td>Name</td><td>${escapeHtml(firstName.trim())} ${escapeHtml(lastName.trim())}</td></tr>
            <tr><td>Email</td><td>${escapeHtml(workEmail.trim())}</td></tr>
          </table>
        `,
      });
      if (error) {
        console.error('Resend error:', error);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit request' });
  }
}
