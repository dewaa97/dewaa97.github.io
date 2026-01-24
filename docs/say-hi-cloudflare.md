# Say Hi! — Cloudflare Worker + Email

This project is hosted on GitHub Pages (static). To send messages without opening the visitor's email client, the "Say Hi!" form can call a Cloudflare Worker endpoint.

## What is actually free?
- **Cloudflare Workers**: has a generous free tier (good for a portfolio).
- **Email sending**: Cloudflare does **not** provide unlimited free outbound email sending by default. This setup uses **MailChannels** via HTTP API. Availability/limits depend on MailChannels policies.

## 1) Deploy the Worker
From `cloudflare/say-hi-worker/`:

```bash
pnpm install
pnpm dev
```

Deploy:

```bash
pnpm deploy
```

## 2) Configure environment vars (Worker)
Set these variables (in Cloudflare dashboard or via `wrangler secret put`):
- `TO_EMAIL`: `dewafakhashiva@duck.com`
- `FROM_EMAIL`: an email address you control (recommended on your own domain). Example: `hi@dewaa97.is-a.dev`

Also configure allowed origins (CORS) in `wrangler.toml`:
- `ALLOWED_ORIGINS`: `https://dewaa97.github.io,https://dewaa97.is-a.dev`

## 3) Configure the frontend
Set `VITE_SAY_HI_API_URL` to your deployed Worker URL:

```bash
VITE_SAY_HI_API_URL=https://YOUR-WORKER.SUBDOMAIN.workers.dev/api/hi
```

If `VITE_SAY_HI_API_URL` is not set, the form automatically falls back to `mailto:`.

## Notes
- The form includes a hidden honeypot field (`website`) to reduce bots.
- For stronger protection, add Cloudflare Turnstile (recommended if you see spam).

