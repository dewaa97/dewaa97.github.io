# Cloudflare Pages deploy

This repo is a static Vite site. The simplest Cloudflare hosting is **Cloudflare Pages**.

## Fixing the deploy error you saw
If you run `wrangler deploy`, Wrangler thinks you're deploying a **Worker** (optionally with static assets) and will ask for `--assets=./dist` or `wrangler.jsonc` config.

For a static website, use **Cloudflare Pages** instead:

- Build output directory: `dist`
- Build command: `pnpm install --frozen-lockfile && pnpm build`

## Automation from GitHub
This repo includes a GitHub Actions workflow: `.github/workflows/deploy-cloudflare-pages.yml`.

To enable it, add these GitHub repo secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`

Notes:
- The workflow deploys `dist` using `wrangler pages deploy`.
- Wrangler collects anonymous telemetry by default; you can disable it per project using `send_metrics=false` in `wrangler.toml` or by setting `WRANGLER_SEND_METRICS=false`.

