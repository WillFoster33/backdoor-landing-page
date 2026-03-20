# Deploy to Vercel

## 1. Add database (for waitlist & venue partner forms)

1. In your Vercel project → **Storage** tab (or **Integrations**).
2. Create a **Postgres** database (Vercel Postgres or Neon).
3. Connect it to your project. Vercel will add `POSTGRES_URL` (or `DATABASE_URL`) as an env var.
4. Redeploy so the API routes can use the database.

The API routes (`/api/waitlist`, `/api/venue-partner`) create tables automatically on first use.

## 2. Deploy

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New** → **Project**.
3. Import `WillFoster33/backdoor-landing-page` (or connect your GitHub and select the repo).
4. Vercel will detect Vite. Click **Deploy**. No config changes needed.

Your site will be live at `backdoor-landing-page.vercel.app` (or a similar URL).

## 3. Custom domain (backdoorpass.app)

1. In your Vercel project → **Settings** → **Domains**.
2. Add `backdoorpass.app`.
3. Add `www.backdoorpass.app` if you want both.
4. Vercel will show DNS records to add at your registrar.

### At your domain registrar

Add the records Vercel provides, for example:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Or use Vercel’s nameservers for automatic DNS.

5. Wait for DNS to propagate (a few minutes). Vercel will issue SSL automatically.

## 4. Local development (optional)

- **Full stack (forms work):** Run `npx vercel dev` so API routes and DB are available locally.
- **Frontend only:** Run `npm run dev`. Forms will fail until you deploy or run `vercel dev`.
