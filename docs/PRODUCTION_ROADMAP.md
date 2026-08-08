# Production deployment guide

Everything needed to take CV Builder from a local checkout to a running production deployment.

---

## 1. Environment

All variables are listed in [`.env.example`](../.env.example). They are validated on server startup by [`src/instrumentation.ts`](../src/instrumentation.ts), so a misconfigured deployment fails fast with every problem listed at once instead of erroring on the first request that needs a secret.

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXTAUTH_SECRET` | ✅ | ≥ 32 characters in production. `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ in prod | Must start with `https://` |
| `MONGODB_URI` | ✅ in prod | The localhost default is rejected in production |
| `OPENAI_API_KEY` | ❌ | Without it the AI endpoints return 503; the rest of the app works |
| `OPENAI_MODEL` | ❌ | Defaults to `gpt-4o-mini` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ❌ | Both or neither |
| `FREE_CV_LIMIT` | ❌ | CVs a new account may create. Default 3 |
| `RATE_LIMIT_ENABLED` | ❌ | Default true. Only disable for load testing |
| `NEXT_PUBLIC_SITE_URL` | ❌ | Canonical URL for sitemap/OG; falls back to `NEXTAUTH_URL` |

Never commit `.env` or `.env.local`. Set production values through your host's secret manager.

### Google OAuth (optional)

1. Google Cloud Console → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Authorised redirect URI: `https://YOUR_DOMAIN/api/auth/callback/google`
4. Add both values to the production environment

The provider is registered only when both variables are present, so leaving them unset is safe. On first Google sign-in the app creates a local user record and maps the session to its Mongo `_id` — without that mapping every CV query would fail, since CVs are keyed by ObjectId.

### Database

**Atlas (recommended)** — create a cluster, a database user with a strong password, and restrict network access to your deployment's egress IPs or a VPC peer.

```
mongodb+srv://USER:PASS@cluster.mongodb.net/cv-builder?retryWrites=true&w=majority
```

URL-encode any special characters in the password.

Indexes are declared on the models and created by Mongoose on first connect:
- `User.email` (unique)
- `CV.userId`, `CV.{userId, createdAt}`, `CV.shareToken` (unique, sparse)
- `Application.userId`, `Application.cvId`, `Application.{userId, createdAt}`

---

## 2. Pre-deploy checks

```bash
npm run ci     # lint + typecheck + test + build — identical to GitHub Actions
npm start      # run the production build locally
```

CI runs on every push and PR to `main`. Do not merge on red.

Smoke-test these flows against the production build:

- [ ] Register, sign out, sign in
- [ ] Google sign-in, if enabled
- [ ] Create, edit and delete a CV
- [ ] Switch templates; confirm every section you filled in appears
- [ ] Switch the interface language; confirm the CV keeps its own output language
- [ ] Export a PDF and use the print view
- [ ] Create a share link, open it signed out, then revoke it and confirm a 404
- [ ] ATS review, improve, translate and cover letter, if `OPENAI_API_KEY` is set
- [ ] Hit the CV quota and confirm the upgrade message
- [ ] `GET /api/health` returns 200

---

## 3. Hosting

### Vercel

1. Import the repository.
2. Framework is detected automatically.
3. Add the environment variables above.
4. Deploy, then set `NEXTAUTH_URL` to the final domain and redeploy.

Every push produces a preview deployment with its own URL; production builds only from `main`.

**Function timeout.** Hobby plans cap execution at 10 seconds. Translating or improving a long CV can exceed that. Use a plan with a longer limit, or move AI calls to a background queue and poll for the result.

**Rate limiting.** Counters live in process memory and each serverless instance has its own. The effective limit is *limit × instances*. For a global guarantee, back `src/lib/rate-limit.ts` with Vercel KV or Redis.

### Docker

```bash
docker build -t cv-builder .
docker run -p 3000:3000 --env-file .env.local cv-builder
```

Multi-stage `output: 'standalone'` build, non-root user, healthcheck on `/api/health`. Pass secrets at runtime — never bake them into the image.

### VPS

```bash
npm ci
npm run build
npm start           # or: pm2 start npm --name cv-builder -- start
```

Put Nginx or Caddy in front for TLS and HTTP→HTTPS redirects. Point your process manager's health check at `/api/health`.

---

## 4. After deploy

- **Uptime** — monitor `GET /api/health`. It returns 503 while MongoDB is unreachable, which is the signal to drain traffic.
- **Error tracking** — add Sentry or similar. `handleApiError` already logs with route context; `error.tsx` surfaces a `digest` you can correlate.
- **Cost control** — AI endpoints are limited to 20 calls/hour/user. Watch OpenAI usage after launch and tune `RATE_LIMITS.ai` and `OPENAI_MODEL`.
- **Backups** — enable Atlas continuous backup or schedule snapshots. CVs are the only data that matters and users cannot recreate them.
- **Dependencies** — schedule `npm audit` and updates.

---

## 5. Known limitations

These are deliberate trade-offs, not oversights. Each is worth revisiting as usage grows.

| Area | Current state | When to change it |
|------|---------------|-------------------|
| Content-Security-Policy | Not set. Base64 images and Next's inline scripts need a nonce pipeline in middleware | Before handling untrusted user content at scale |
| Rate limiting | Per-instance, in memory | As soon as you run more than one instance |
| Profile photos | Base64 inline on the CV document, capped at ~2 MB | If documents approach Mongo's 16 MB limit — move to object storage |
| Billing | `cvLimit` is enforced, but there is no payment flow. `/pricing` is informational | When you start charging; the quota seam is already in place |
| AI latency | Synchronous request/response | If serverless timeouts start biting |
| i18n routing | Locale is a client preference, not a URL segment | If you need per-language SEO — that requires `/[locale]/` routes |
