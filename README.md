# CV Builder – Modern CV Creation Platform

AI destekli, çok dilli CV oluşturma platformu. Next.js, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

- **AI önerileri**: CV içeriğini ve biçimini iyileştirmek için kişiselleştirilmiş öneriler
- **ATS uyumluluğu**: ATS incelemesi ve puanlama
- **Profesyonel şablonlar**: 25+ şablon
- **Çok dilli**: CV’yi birden fazla dile çevirme (AI ile)
- **Bulut depolama**: CV’leri kaydetme ve yönetme
- **Responsive**: Tüm cihazlarda uyumlu arayüz

## Desteklenen Diller (i18n)

- English, Türkçe, Deutsch, Русский, العربية, Français

## Gereksinimler

- Node.js 18+
- npm veya yarn

## Kurulum

1. Repoyu klonlayın ve bağımlılıkları yükleyin:

```bash
git clone https://github.com/cotneo/next-cv-app.git
cd next-cv-app
npm install
```

2. `.env.local` oluşturun:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/cv-builder

# Opsiyonel: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI özellikleri (ATS, çeviri, iyileştirme) için
OPENAI_API_KEY=your-openai-api-key
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js (JWT, Credentials + Google OAuth)
- **Veritabanı**: MongoDB (Mongoose)
- **AI**: OpenAI API (GPT-4)

## Proje Yapısı

```
src/
├── app/
│   ├── api/          # auth (NextAuth, register), cv (CRUD + aksiyonlar)
│   ├── auth/         # login, register
│   ├── dashboard/    # liste, [id] detay/düzenleme, new
│   ├── create/       # CV oluşturma
│   ├── templates, pricing, about, contact
│   └── layout, page
├── components/       # Navbar, Footer, CVForm, FeatureCard, vb.
├── hooks/            # useTranslation
├── i18n/             # Dil ayarları ve çeviriler
├── lib/              # auth, mongodb, openai
├── models/           # User, CV (Mongoose)
├── services/         # cvService
└── types/
```

## Kimlik Doğrulama

- E-posta / şifre (kayıt + giriş)
- Google OAuth (opsiyonel)
- Korumalı rotalar (dashboard, CV CRUD)
- JWT oturum yönetimi

## API Özeti

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/auth/register` | POST | Kullanıcı kaydı |
| `/api/cv` | GET | CV listesi |
| `/api/cv` | POST | Yeni CV oluştur |
| `/api/cv/[id]` | GET, PUT, DELETE | CV getir/güncelle/sil |
| `/api/cv/[id]` | POST | Aksiyonlar: `ats-review`, `translate`, `improve` |

## Lisans

MIT – detaylar için [LICENSE](LICENSE) dosyasına bakın.
