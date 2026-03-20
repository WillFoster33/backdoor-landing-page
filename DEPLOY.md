# Deploy to Vercel

## 1. Deploy

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New** → **Project**.
3. Import `WillFoster33/backdoor-landing-page` (or connect your GitHub and select the repo).
4. Vercel will detect Vite. Click **Deploy**. No config changes needed.

Your site will be live at `backdoor-landing-page.vercel.app` (or a similar URL).

## 2. Custom domain (backdoorpass.app)

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

## 3. Waitlist API (optional)

If you use the waitlist API, add an env var in Vercel:

1. **Settings** → **Environment Variables**
2. Add `VITE_API_URL` = your API URL (e.g. Railway/Render URL)
3. Redeploy so the new value is picked up

If you don’t have an API yet, the form will fail in production until you deploy the server or switch to a form service like Formspree.
