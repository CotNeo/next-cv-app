# CV Builder

AI-assisted, multilingual CV builder. Next.js 15 (App Router), TypeScript, Tailwind CSS v4, MongoDB and OpenAI.

Create a CV from 16 professional templates, get an ATS score and rewrite suggestions, translate it into six languages, generate a tailored cover letter, export to PDF and share it with a revocable public link.

---

## Features

**CV editor**
- Six-step form covering personal details, work experience, education, skills, languages, certifications, projects and references
- Profile photo upload with type and size validation (2 MB)
- "Currently working / studying / ongoing" handling on every dated section
- Live preview and template switching while editing

**Templates**
- 16 templates across 5 categories, each rendering *every* section — nothing you enter is silently dropped
- Per-CV output language: browse the app in Turkish and still produce an English CV
- Right-to-left layout for Arabic
- Print- and PDF-optimised

**AI (optional, requires `OPENAI_API_KEY`)**
- **ATS review** — a real 0–100 score plus specific recommendations, both from the model
- **Improve** — rewrites the CV's prose to be more impactful and ATS-friendly
- **Translate** — rewrites the CV into any supported language and updates its output language
- **Cover letters** — tailored to a job title, company and description; saved and listed under *Cover letters*

**Sharing and export**
- Revocable share links backed by a 256-bit token; public responses omit owner and scoring fields
- Client-side PDF export and print stylesheet

**Interface**
- Six languages: English, Türkçe, Deutsch, Français, Русский, العربية
- Language switching without a page reload; `<html lang>` and `dir` stay in sync
- Three.js hero animation, toast notifications, confirmation dialogs

---

## Requirements

- Node.js 20+
- MongoDB (local or Atlas)
- An OpenAI API key — optional; without it the AI endpoints return 503 and everything else works

## Getting started

```bash
git clone https://github.com/cotneo/next-cv-app.git
cd next-cv-app
npm install
cp .env.example .env.local   # then fill in NEXTAUTH_SECRET and MONGODB_URI
npm run dev
```

Open http://localhost:3000.

Generate a session secret with:

```bash
openssl rand -base64 32
```

See [.env.example](.env.example) for every variable. The environment is validated when the server starts ([src/instrumentation.ts](src/instrumentation.ts)), so a misconfigured deployment fails immediately with a list of what is wrong rather than erroring on the first request.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (103 tests) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run ci` | lint + typecheck + test + build — same as CI |
| `npm run create-test-user` | Seeds a local test account (see [TEST_USER.md](TEST_USER.md)) |

## Tech stack

- **Framework** Next.js 15 (App Router), React 19
- **Language** TypeScript (strict)
- **Styling** Tailwind CSS v4 + a small PostCSS plugin that rewrites `oklch()` to `rgb()` so html2canvas can parse the CSS
- **Auth** NextAuth v4 — credentials (bcrypt, cost 12) and optional Google OAuth, JWT sessions
- **Database** MongoDB via Mongoose
- **AI** OpenAI Chat Completions with JSON mode
- **Validation** Zod, on every API boundary and on AI output
- **3D** Three.js, @react-three/fiber, @react-three/drei
- **PDF** html2pdf.js, dynamically imported so it stays out of the initial bundle
- **Tests** Vitest

---

## Architecture

```
src/
├── app/
│   ├── api/                    Route handlers: session → validate → service
│   ├── auth/                   Sign in, sign up, auth error
│   ├── cv/[token]/             Public shared CV
│   ├── dashboard/              CV list, editor, preview, cover letters
│   ├── templates/              Gallery and per-template detail
│   ├── layout.tsx              Server component: metadata, fonts
│   ├── providers.tsx           Client providers: session, locale, toasts
│   ├── error.tsx global-error.tsx not-found.tsx
│   └── robots.ts sitemap.ts
├── components/
│   ├── CVForm.tsx              Six-step editor
│   ├── cv/CVRender.tsx         16 template layouts
│   ├── cv/sections.tsx         Shared section renderers
│   └── cv/section-data.ts      Section keys, presence checks, URL guard (pure)
├── data/templates.ts           Canonical template catalogue
├── hooks/useTranslation.ts     Translation lookup with interpolation
├── i18n/
│   ├── LocaleProvider.tsx      Interface locale + <html lang/dir>
│   ├── settings.ts             Locales, RTL, Intl tags
│   ├── cv-labels.ts            CV section headings per language
│   └── translations/           en, tr, de, fr, ru, ar
├── lib/
│   ├── env.ts                  Zod-validated environment
│   ├── errors.ts api.ts        ApiError + one error exit point per route
│   ├── validation.ts           Request and AI-output schemas
│   ├── rate-limit.ts           Fixed-window limiter
│   ├── auth.ts mongodb.ts openai.ts site.ts
├── models/                     User, CV, Application
├── services/                   cvService, applicationService, userService
├── middleware.ts               Server-side gate on /dashboard
└── instrumentation.ts          Startup environment validation
```

**Request flow.** Route handlers resolve the session (`requireUserId`), apply a rate limit, parse the body with a Zod schema, then call a service. Services own database access and ownership checks. Every handler funnels failures through `handleApiError`, which preserves intentional statuses and reports everything else as a generic 500 with the details logged server-side.

**Ownership.** Every query is scoped by `{ _id, userId }`, so another user's CV is indistinguishable from a missing one.

**AI output.** Model responses are parsed, narrowed to a whitelist of content fields and re-validated before being written. A response that is malformed, empty or tries to set `isPublic`, `shareToken` or `atsScore` is rejected rather than persisted.

---

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/auth/register` | POST | Register (rate limited: 10/hour/IP) |
| `/api/cv` | GET | List the caller's CVs (photo excluded) |
| `/api/cv` | POST | Create a CV; 402 when the quota is used up |
| `/api/cv/[id]` | GET, PUT, DELETE | Read, update, delete |
| `/api/cv/[id]` | POST | AI actions: `ats-review`, `translate`, `improve` (20/hour/user) |
| `/api/cv/[id]/cover-letter` | POST | Generate and store a cover letter |
| `/api/cv/[id]/share` | POST, DELETE | Create or revoke a share token |
| `/api/cv/public/[token]` | GET | Public CV (120/min/IP) |
| `/api/applications` | GET | Cover letters |
| `/api/applications/[id]` | GET, DELETE | Read or delete a cover letter |
| `/api/quota` | GET | `{ used, limit, remaining }` |
| `/api/health` | GET | Liveness probe; 503 while the database is unreachable |

Errors are `{ error, code, details? }`. Clients branch on `code` (`quota_exceeded`, `validation_failed`, `rate_limited`, `ai_unavailable`, …) rather than on the message.

## Security

- Session-scoped queries on every read and write; 404 rather than 403 for other users' records
- Zod validation on every request body, with per-field errors
- URLs are restricted to `http(s)` on write **and** at render time — `javascript:` in a CV field would otherwise be stored XSS on public share pages
- Passwords are bcrypt-hashed and `select: false`; sign-in failures are indistinguishable between unknown email and wrong password
- Rate limits on auth, AI and write endpoints
- Security headers and `no-store` on API responses ([next.config.ts](next.config.ts))
- `robots.ts` keeps `/dashboard`, `/cv`, `/auth` and `/api` out of search indexes

The rate limiter keeps counters in process memory, so on a multi-instance deployment the effective limit is *limit × instances*. Move it to Redis or Vercel KV if you need a global guarantee.

No Content-Security-Policy is set: the app renders user-supplied base64 images and Next injects inline bootstrap scripts, so a useful policy needs a nonce pipeline in middleware. That is the main remaining hardening step.

## Deployment

### Vercel
Import the repository, add the environment variables from `.env.example`, deploy. Every push gets a preview URL.

Serverless functions have an execution limit (10 s on Hobby). AI calls can exceed it on long CVs — use a plan with a longer limit or move the AI work to a queue.

### Docker
```bash
docker build -t cv-builder .
docker run -p 3000:3000 --env-file .env.local cv-builder
```
The image is a multi-stage `output: 'standalone'` build running as a non-root user, with a healthcheck on `/api/health`.

### Anything else
Node 20+, `npm ci && npm run build && npm start` behind a reverse proxy with TLS. Point your uptime monitor at `/api/health`.

More detail: [docs/PRODUCTION_ROADMAP.md](docs/PRODUCTION_ROADMAP.md).

## Documentation

| File | Contents |
|------|----------|
| [docs/PRODUCTION_ROADMAP.md](docs/PRODUCTION_ROADMAP.md) | Deployment checklist and operations |
| [MONGODB_SETUP.md](MONGODB_SETUP.md) | Local and hosted MongoDB setup |
| [TEST_USER.md](TEST_USER.md) | Test account |
| [.env.example](.env.example) | Every environment variable |

## Licence

MIT — see [LICENSE](LICENSE).

## Author

**Furkan Akar (CotNeo)** — [GitHub](https://github.com/cotneo) · [LinkedIn](https://www.linkedin.com/in/furkanaliakar/) · [cotneo.com](https://www.cotneo.com)
