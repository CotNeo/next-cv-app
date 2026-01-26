# CV Builder – Modern CV Creation Platform

AI-powered, multilingual CV creation platform. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **AI suggestions**: Personalized recommendations to improve CV content and formatting
- **ATS compatibility**: ATS review and scoring
- **Professional templates**: 16+ templates with thumbnails and detail preview
- **Multilingual**: Translate your CV into multiple languages (AI-powered)
- **Cloud storage**: Save and manage your CVs
- **Responsive**: Consistent experience across all devices

## Supported Languages (i18n)

- English, Türkçe, Deutsch, Русский, العربية, Français

## Requirements

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/cotneo/next-cv-app.git
cd next-cv-app
npm install
```

2. Create `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/cv-builder

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI features (ATS, translate, improve)
OPENAI_API_KEY=your-openai-api-key
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js (JWT, Credentials + Google OAuth)
- **Database**: MongoDB (Mongoose)
- **AI**: OpenAI API (GPT-4)

## Project Structure

```
src/
├── app/
│   ├── api/          # auth (NextAuth, register), cv (CRUD + actions)
│   ├── auth/         # login, register
│   ├── dashboard/    # list, [id] detail/edit, new
│   ├── create/       # CV creation
│   ├── templates, pricing, about, contact
│   └── layout, page
├── components/       # Navbar, Footer, CVForm, FeatureCard, etc.
├── hooks/            # useTranslation
├── i18n/             # Language settings and translations
├── lib/              # auth, mongodb, openai
├── models/           # User, CV (Mongoose)
├── services/         # cvService
└── types/
```

## Authentication

- Email / password (register + login)
- Google OAuth (optional)
- Protected routes (dashboard, CV CRUD)
- JWT session management

## API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/auth/register` | POST | User registration |
| `/api/cv` | GET | List CVs |
| `/api/cv` | POST | Create new CV |
| `/api/cv/[id]` | GET, PUT, DELETE | Get / update / delete CV |
| `/api/cv/[id]` | POST | Actions: `ats-review`, `translate`, `improve` |

## License

MIT – see [LICENSE](LICENSE) for details.
