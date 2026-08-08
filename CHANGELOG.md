# Changelog

Notable changes to CV Builder. Format based on [Keep a Changelog](https://keepachangelog.com/);
this project follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-08-08

Production-readiness overhaul. The application now builds, validates its
configuration on startup, enforces its own quotas, and no longer loses user data
between the editor and the rendered CV.

### Fixed

- **`main` did not build.** `getApplicationById` dereferenced the union type
  returned by Mongoose's `.lean()`, failing `next build` and therefore CI and
  every deployment. (`src/services/applicationService.ts`)
- **Google sign-in was broken end to end.** The provider was registered but no
  adapter or `signIn` callback existed, so no local user record was created and
  the session carried Google's account id. Because every CV is keyed by a Mongo
  `ObjectId`, the first dashboard request after a Google sign-in threw a
  `CastError` and returned 500. Sign-in now upserts a local user and maps the
  session to its `_id`, handling the concurrent-signup race.
- **The ATS score was fabricated.** It was `Math.min(95, 60 + random(35))` — a
  random number unrelated to the reviewed CV. The model now returns a real
  0–100 score alongside its recommendations, in a single structured response.
- **Most templates silently discarded user data.** Of 12 distinct template
  bodies, only `modern` rendered all eight sections: **Languages was missing
  from 11**, and certifications, projects and references from three. Anything
  typed into those fields never appeared on the CV or in the PDF.
- **Stored XSS via CV links.** `z.string().url()` accepts `javascript:`, and
  website, LinkedIn, project and credential URLs are rendered into `href`
  attributes — including on public share pages. URLs are now restricted to
  `http(s)` both on write and at render time.
- **Revoking a second share link failed.** `shareToken` was set to `null`, which
  collides on the unique sparse index once a second CV is unshared. The field is
  now `$unset`.
- **Template names showed raw translation keys.** Lookups used `templates.*`
  while the strings live under `home.templates.*`, so the template picker and
  detail pages rendered the key itself.
- **`.env.example` was covered by `.gitignore`,** so the file the README tells
  you to copy would never reach a fresh clone.
- Template search matched hardcoded Turkish descriptions regardless of the
  selected interface language.
- Broken sidebar layouts: `classic` and `elegant` placed a name, contact block
  and summary inside a 64–80px column.

### Added

- **Environment validation** (`src/lib/env.ts`, `src/instrumentation.ts`).
  Parsed with Zod at server startup, reporting every problem at once. Production
  additionally requires a 32-character secret, an `https` (or loopback) URL and
  an explicit database URI.
- **Request validation** on every endpoint, with per-field errors returned as
  `{ error, code, details }`.
- **AI output is validated before it is persisted.** Model responses are parsed,
  narrowed to a whitelist of content fields and re-validated; a response that is
  malformed, empty, or attempts to set `isPublic`, `shareToken` or `atsScore` is
  rejected rather than written to the CV.
- **Rate limiting** on auth (10/h/IP), AI (20/h/user), writes (60/min/user) and
  public reads (120/min/IP).
- **CV quota enforcement.** `cvLimit` existed on the model but was never checked.
  Creating past the limit returns 402; the dashboard shows usage and links to
  pricing. New endpoint: `GET /api/quota`.
- **Cover letter management.** `listUserApplications` and friends existed but
  were unreachable. Added `GET/DELETE /api/applications[/:id]` and the
  `/dashboard/applications` page.
- **Per-CV output language.** A CV stores the language it is written in, so a
  Turkish interface can produce an English CV. Section headings and dates follow
  the document, not the interface.
- **Right-to-left rendering** for Arabic across the app and inside every CV.
- `/auth/error` (referenced by NextAuth but missing), `not-found`, `error` and
  `global-error` pages.
- `GET /api/health` — returns 503 while the database is unreachable.
- `middleware.ts` — server-side gate on `/dashboard`.
- `robots.ts` and `sitemap.ts`; private areas and share links are excluded.
- Security headers and `no-store` on API responses (`next.config.ts`).
- Test suite: **106 Vitest tests** covering validation, AI-output sanitisation,
  rate limiting, environment parsing, translation parity and section coverage.
- Multi-stage `Dockerfile` (standalone output, non-root, healthcheck) and
  `.dockerignore`.
- `.env.example` documenting every variable.

### Changed

- **The CV form is translatable.** 90 hardcoded Turkish strings replaced with
  translation keys; the interface language now genuinely applies to the app's
  central screen. Translations total **578 keys across 6 languages**, kept in
  sync by a test.
- **`CVRender` rebuilt** on shared section renderers driven by per-template
  typography tokens. Each template keeps the visual identity shown in its
  thumbnail, but sections are defined once, so a template can no longer skip a
  field. The `sectionCoverageGap()` invariant is asserted in tests.
- **Language switching no longer reloads the page.** A `LocaleProvider` holds
  the locale and keeps `<html lang>` and `<html dir>` in sync; the per-page
  `localStorage` boilerplate is gone from 17 files.
- The root layout is a server component again, restoring `metadata`, Open Graph
  and Twitter tags.
- API errors are consistent: known failures keep their status and a stable
  `code`; everything else is logged with route context and returned as a generic
  500. Clients branch on `code`, not on message text.
- Ownership is enforced by scoping every query to `{ _id, userId }`, so another
  user's CV is indistinguishable from a missing one.
- Sign-in failures no longer reveal whether an email is registered. Accounts
  created through OAuth get a specific hint instead of a dead end.
- Passwords are `select: false` on the schema and never leave the server.
- The CV list endpoint no longer ships base64 profile photos to the dashboard.
- `html2pdf.js` is dynamically imported: the CV view route dropped from
  **443 kB to 182 kB** of first-load JavaScript.
- OpenAI model is configurable via `OPENAI_MODEL` (default `gpt-4o-mini`), with
  JSON mode, timeouts, retries and provider errors mapped to actionable statuses.
- Registration requires 8+ characters with a letter and a digit.
- CI runs lint → typecheck → test → build (`npm run ci`).

### Removed

- `src/models/User.mjs` — a conflicting duplicate of the `User` model.
- `src/app/create/page.tsx` — an unlinked duplicate of `/dashboard/new`.
- `LanguageSwitcher.tsx` and `layout/LanguageSelector.tsx` — unreferenced.
- Eight unused dependencies: `puppeteer` (~300 MB of CI install time),
  `cloudinary`, `@stripe/stripe-js`, `react-pdf`, `next-sitemap`,
  `next-i18next`, `@hookform/resolvers`, `@types/html2pdf.js`.

### Known limitations

Deliberate trade-offs, tracked in [docs/TODO.md](docs/TODO.md): no payment flow,
no Content-Security-Policy, per-instance rate limiting, and no automated test
against a real database.

---

## [0.1.0]

Initial release.
