# CV Builder - Modern CV Creation Platform

CV Builder is a modern, AI-powered platform that helps professionals create stunning resumes and CVs. Built with Next.js, TypeScript, and Tailwind CSS, it offers a seamless experience for creating professional documents.

## 🌟 Features

- **AI-Powered Suggestions**: Get personalized recommendations to improve your CV content and formatting
- **ATS Optimization**: Ensure your CV passes through Applicant Tracking Systems
- **Professional Templates**: Choose from 25+ professionally designed templates
- **Multilingual Support**: Create and translate your CV in multiple languages
- **Real-time Preview**: See your changes instantly
- **Cloud Storage**: Save and access your CVs from anywhere
- **PDF Export**: Download your CV in PDF format
- **Responsive Design**: Works perfectly on all devices

## 🗣️ Supported Languages

- English (English)
- Türkçe (Turkish)
- Deutsch (German)
- Русский (Russian)
- العربية (Arabic)
- Français (French)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **ORM**: Prisma
- **UI Components**: Custom components with Tailwind CSS
- **Form Handling**: React Hook Form
- **State Management**: React Context
- **Internationalization**: Custom i18n solution

## 📦 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── pricing/           # Pricing page
│   ├── templates/         # Templates page
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── hooks/                 # Custom hooks
├── i18n/                  # Internationalization
│   ├── settings.ts        # Language settings
│   └── translations/      # Translation files
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── types/                 # TypeScript types
```

## 🔒 Authentication

- Google OAuth integration
- Email/password authentication
- Protected routes
- Session management

## 💳 Pricing Plans

1. **Free Plan** ($0)
   - 1 free CV creation
   - Basic templates
   - PDF export
   - Basic support

2. **Pay-as-you-go** ($0.50/CV)
   - Unlimited CVs
   - All templates
   - AI suggestions
   - ATS optimization
   - Priority support

3. **Monthly Plan** ($3/month)
   - All features
   - Cloud storage
   - Collaboration tools
   - Premium support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS team for the utility-first CSS framework
- All contributors and users of CV Builder
