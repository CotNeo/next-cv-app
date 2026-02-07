# CV Builder – Modern CV Creation Platform

AI-powered, multilingual CV creation platform. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **AI-Powered Suggestions**: Personalized recommendations to improve CV content and formatting
- **ATS Optimization**: ATS review and scoring with detailed feedback
- **Professional Templates**: 16 professionally designed templates with category filtering
- **Template Selection**: Choose templates when creating or editing CVs
- **Multilingual Support**: Translate your CV into multiple languages (AI-powered)
- **Cloud Storage**: Save and manage unlimited CVs
- **Responsive Design**: Consistent experience across all devices

### Advanced Features
- **Profile Photo Upload**: Add profile pictures with size and format validation
- **Comprehensive CV Fields**: 
  - Personal information (name, email, phone, location, website, LinkedIn, profile photo)
  - Work experience with "currently working" option
  - Education with "currently studying" option
  - Skills and languages
  - Certifications (name, issuer, date, credential ID, URL)
  - Projects (name, description, technologies, URL, dates)
  - References (name, position, company, email, phone)
- **Public CV Sharing**: Generate shareable links for your CV
- **PDF Export**: Download CVs as PDF files
- **CV Preview**: Real-time preview of your CV
- **Multi-step Form**: Intuitive 6-step CV creation process
- **Toast Notifications**: User-friendly feedback for all actions
- **Confirmation Modals**: Safe deletion with confirmation dialogs

### UI/UX Features
- **3D Hero Animation**: Futuristic Three.js animated background
- **Modern Design System**: Stone and teal color palette
- **Typography**: Plus Jakarta Sans font family
- **Loading States**: Enhanced loading indicators
- **Error Handling**: Comprehensive error messages and recovery

## 📄 Pages

- **Home** (`/`): Landing page with hero section, features, and how it works
- **Templates** (`/templates`): Browse all CV templates with category filtering
- **Template Preview** (`/templates/[id]`): Detailed preview of each template
- **Dashboard** (`/dashboard`): List all your CVs
- **New CV** (`/dashboard/new`): Create new CV with template selection
- **CV Detail** (`/dashboard/[id]`): View, edit, and manage CV
- **CV View** (`/dashboard/[id]/view`): Full-screen CV preview with PDF export
- **Public CV** (`/cv/[token]`): Publicly shared CV view
- **Pricing** (`/pricing`): Pricing plans
- **About** (`/about`): About page with team information
- **Contact** (`/contact`): Contact form
- **Privacy** (`/privacy`): Privacy policy
- **Terms** (`/terms`): Terms of service
- **FAQ** (`/faq`): Frequently asked questions
- **Auth** (`/auth/login`, `/auth/register`): Authentication pages

## 🌍 Supported Languages (i18n)

- English
- Türkçe (Turkish)
- Deutsch (German)
- Русский (Russian)
- العربية (Arabic)
- Français (French)

## 📋 Requirements

- Node.js 18+
- npm or yarn
- MongoDB (local or cloud instance)

## 🛠️ Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/cotneo/next-cv-app.git
cd next-cv-app
npm install
```

2. Create `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/cv-builder

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Required for AI features (ATS review, translate, improve)
OPENAI_API_KEY=your-openai-api-key
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ CI & test ortamı

- **Her push/PR:** GitHub Actions `main` için lint + build çalıştırır (`npm run ci`). Commit’i push etmeden önce yerel kontrol için: `npm run ci`.
- **Canlı test:** Repo Vercel’e bağlıysa her push’ta otomatik **Preview** deployment oluşur; PR’larda ve branch’lerdeki her commit için ayrı test URL’i alırsın. Vercel Dashboard → Project → Settings → Git ile GitHub bağlantısını kontrol et.

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Auth**: NextAuth.js v4 (JWT, Credentials + Google OAuth)
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI API (GPT-4)
- **PDF Export**: html2pdf.js
- **Forms**: react-hook-form with Zod validation
- **Notifications**: react-hot-toast
- **UI Components**: Custom components with Tailwind CSS

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth handler
│   │   │   └── register/         # User registration
│   │   └── cv/
│   │       ├── route.ts          # List and create CVs
│   │       ├── [id]/
│   │       │   ├── route.ts      # Get, update, delete CV
│   │       │   └── share/        # Generate/revoke share tokens
│   │       └── public/[token]/   # Public CV access
│   ├── auth/                     # Login, register pages
│   ├── dashboard/
│   │   ├── page.tsx              # CV list
│   │   ├── new/
│   │   │   └── page.tsx          # Create new CV with template selection
│   │   ├── [id]/
│   │   │   ├── page.tsx         # CV detail/edit with template selection
│   │   │   └── view/
│   │   │       └── page.tsx     # CV preview and PDF export
│   │   └── page.tsx
│   ├── cv/[token]/               # Public CV view
│   ├── templates/
│   │   ├── page.tsx              # Template gallery
│   │   └── [id]/
│   │       └── page.tsx          # Template preview
│   ├── pricing/                  # Pricing page
│   ├── about/                     # About page
│   ├── contact/                   # Contact page
│   ├── privacy/                   # Privacy policy
│   ├── terms/                     # Terms of service
│   ├── faq/                       # FAQ page
│   ├── layout.tsx                 # Root layout with Toaster
│   └── page.tsx                   # Home page with 3D hero
├── components/
│   ├── CVForm.tsx                 # Multi-step CV form
│   ├── Hero3D.tsx                 # Three.js 3D animation
│   ├── Navbar.tsx                 # Navigation bar
│   ├── Footer.tsx                 # Footer component
│   ├── ConfirmModal.tsx           # Confirmation dialog
│   ├── cv/
│   │   └── CVRender.tsx           # CV template renderer (16 templates)
│   ├── templates/
│   │   ├── TemplateThumbnail.tsx  # Template thumbnail component
│   │   └── TemplatePreview.tsx    # Template preview component
│   └── features/
│       ├── FeatureCard.tsx        # Feature card component
│       └── HowItWorksStep.tsx     # How it works step component
├── hooks/
│   └── useTranslation.ts          # i18n translation hook
├── i18n/
│   ├── settings.ts                # i18n configuration
│   └── translations/              # Translation files (en, tr, de, ru, ar, fr)
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── mongodb.ts                 # MongoDB connection
│   └── openai.ts                  # OpenAI client
├── models/
│   ├── User.ts                    # User Mongoose model
│   └── CV.ts                      # CV Mongoose model
├── services/
│   ├── cvService.ts               # CV service functions
│   └── db.ts                      # Database utilities
└── types/
    └── next-auth.d.ts             # NextAuth type definitions
```

## 🔐 Authentication

- **Email/Password**: Register and login with email and password
- **Google OAuth**: Optional Google authentication
- **Protected Routes**: Dashboard and CV management require authentication
- **JWT Sessions**: Secure session management with NextAuth.js

## 📡 API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth authentication handler |
| `/api/auth/register` | POST | User registration |
| `/api/cv` | GET | List user's CVs |
| `/api/cv` | POST | Create new CV |
| `/api/cv/[id]` | GET | Get CV details |
| `/api/cv/[id]` | PUT | Update CV |
| `/api/cv/[id]` | DELETE | Delete CV |
| `/api/cv/[id]` | POST | AI actions: `ats-review`, `translate`, `improve` |
| `/api/cv/[id]/share` | POST | Generate share token |
| `/api/cv/[id]/share` | DELETE | Revoke share token |
| `/api/cv/public/[token]` | GET | Get public CV by share token |

## 🎨 CV Templates

16 professionally designed templates across 5 categories:

- **Professional**: Modern, Classic, Professional, Executive, Elegant, Corporate
- **Minimalist**: Minimal, Clean
- **Technical**: Technical, Developer
- **Creative**: Creative, Artistic, Portfolio, Innovative
- **Academic**: Academic, Scholar

Each template supports:
- Profile photo display
- All CV sections (work, education, skills, languages, certifications, projects, references)
- "Currently working/studying" indicators
- Responsive design
- Print/PDF optimization

## 🚀 Key Features Details

### Template Selection
- Choose from 16 templates when creating a new CV
- Change template when editing existing CV
- Category-based filtering
- Visual template thumbnails
- Template preview before selection

### AI Features
- **ATS Review**: Get ATS compatibility score and suggestions
- **Translation**: Translate CV to multiple languages (English, Turkish, German, French, Russian, Arabic)
- **Improvement**: Get AI-powered suggestions to enhance CV content

### CV Sharing
- Generate unique shareable links
- Public CV viewing without authentication
- Revoke sharing anytime
- Share token-based access

### PDF Export
- Export CV as PDF
- Print-optimized layouts
- All templates support PDF export
- High-quality rendering

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run ci           # Lint + build (CI / pre-push check)
npm run create-test-user  # Create test user (requires MongoDB)
```

## 🔧 Development

### Creating a Test User

1. Ensure MongoDB is running and configured in `.env.local`
2. Run the test user creation script:

```bash
npm run create-test-user
```

See `TEST_USER.md` for test user credentials.

### MongoDB Setup

For Docker MongoDB setup, see `MONGODB_SETUP.md`.

### Dokümantasyon

| Dosya | İçerik |
|-------|--------|
| [docs/PRODUCTION_ROADMAP.md](docs/PRODUCTION_ROADMAP.md) | Production deploy ve Vercel yol haritası |
| [MONGODB_SETUP.md](MONGODB_SETUP.md) | MongoDB kurulumu ve test kullanıcısı script’i |
| [TEST_USER.md](TEST_USER.md) | Test kullanıcı bilgileri ve oluşturma yöntemleri |

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

## 👤 Author

**Furkan Akar (CotNeo)**
- GitHub: [@cotneo](https://github.com/cotneo)
- LinkedIn: [furkanaliakar](https://www.linkedin.com/in/furkanaliakar/)
- Website: [cotneo.com](https://www.cotneo.com)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Three.js community for 3D graphics
- OpenAI for AI capabilities
- All contributors and users
