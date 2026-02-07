# CV Builder – Production Yol Haritası

Bu doküman, next-cv-app uygulamasının production ortamına güvenli ve sürdürülebilir şekilde çıkışı için adım adım yol haritasıdır.

---

## 1. Ön Hazırlık

### 1.1 Ortam Değişkenleri (Env)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXTAUTH_URL` | ✅ | Prod URL (örn. `https://cv.example.com`) |
| `NEXTAUTH_SECRET` | ✅ | Güçlü rastgele string (`openssl rand -base64 32`) |
| `MONGODB_URI` | ✅ | MongoDB bağlantı URI (Atlas veya managed DB) |
| `OPENAI_API_KEY` | ✅ | AI özellikleri için (ATS, çeviri, iyileştirme) |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth (opsiyonel) |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth (opsiyonel) |

- **Asla** `.env` / `.env.local` dosyalarını git’e commit etmeyin.
- Prod’da env’leri hosting panelinden veya secrets manager’dan tanımlayın.

### 1.2 Google OAuth (Opsiyonel)

Google kullanmak istemiyorsanız, auth config’de provider’ı env varken ekleyecek şekilde güncelleme yapın (aksi halde boş string ile hata riski vardır). Kullanacaksanız:

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. OAuth 2.0 Client ID oluşturun (Web application)
3. Authorized redirect URI: `https://SITE_DOMAIN/api/auth/callback/google`
4. `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET`’i prod env’e ekleyin.

### 1.3 Veritabanı (MongoDB)

- **MongoDB Atlas** (önerilen): Ücretsiz tier veya paid cluster, IP whitelist / VPC, kullanıcı şifresi güçlü olsun.
- **Managed MongoDB** (DigitalOcean, AWS DocumentDB vb.): Bağlantı string’ini prod’a uygun alın.
- `MONGODB_URI` formatı: `mongodb+srv://USER:PASS@cluster.mongodb.net/DB?retryWrites=true&w=majority`
- Şifrede özel karakter varsa URL-encode edin.

---

## 2. Kod ve Güvenlik Kontrolleri

### 2.1 Yapılacaklar

- [ ] **NEXTAUTH_SECRET** geliştirme ortamında farklı, prod’da güçlü ve benzersiz olsun.
- [ ] **CORS / güvenlik başlıkları**: Hosting’e göre gerekirse `next.config.ts` veya reverse proxy ile ayarlayın.
- [ ] **Rate limiting**: Özellikle `/api/auth/*`, `/api/cv` ve AI endpoint’leri için düşünün (Vercel’de edge/config, kendi sunucunuzda middleware veya API gateway).
- [ ] **API hata mesajları**: Prod’da detaylı stack trace veya DB bilgisi dönmeyin; genel mesaj + log’a detay yazın.
- [ ] **Google OAuth**: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` yoksa provider’ı eklemeyin (kod tarafında conditional provider önerilir).

### 2.2 Build ve Test

```bash
npm run ci      # Lint + build (CI ile aynı)
npm run build
npm run start   # Lokal prod simülasyonu
```

- **CI:** Her push/PR’da GitHub Actions lint + build çalıştırır; yeşil olmadan merge etmeyin.
- Build’in hatasız bittiğini ve `npm run start` ile sayfaların açıldığını doğrulayın.
- Kritik akışlar: kayıt, giriş, CV oluşturma/düzenleme, PDF indirme, paylaşım linki.

---

## 3. Hosting Seçenekleri

### 3.1 Vercel (Önerilen – Next.js ile uyumlu)

1. Repo’yu GitHub/GitLab/Bitbucket’a bağlayın.
2. [Vercel](https://vercel.com) → New Project → Import repo.
3. Framework: Next.js (otomatik algılanır).
4. **Environment Variables** ekleyin: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `MONGODB_URI`, `OPENAI_API_KEY`, (ops.) `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
5. `NEXTAUTH_URL`: Production için `https://your-app.vercel.app` (veya custom domain).
6. Deploy; custom domain varsa Vercel’de Domain ayarlarından ekleyin.

- **Test ortamı:** Repo GitHub’a bağlıysa her push ve her PR için otomatik **Preview** deployment oluşur; her commit’i canlı test URL’i ile deneyebilirsiniz. Production deploy sadece `main` (veya seçtiğiniz production branch) için yapılır.

**Not:** Serverless fonksiyon timeout’ları (örn. 10 sn) AI/uzun işlemlerde yetersiz kalabilir; gerekirse Pro plan veya farklı mimari (queue + worker) düşünün.

### 3.2 Kendi Sunucunuz (VPS / VM)

1. **Node.js** 18+ kurun.
2. Repo’yu clone edin, `npm ci`, `npm run build`, `npm run start`.
3. **Process manager**: PM2 örnek:
   ```bash
   npm install -g pm2
   pm2 start npm --name "cv-builder" -- start
   pm2 save && pm2 startup
   ```
4. **Reverse proxy**: Nginx/Caddy ile `https` ve `proxy_pass` ile Node’a yönlendirin.
5. **SSL**: Let’s Encrypt (örn. `certbot`) veya Caddy otomatik SSL.

### 3.3 Docker

- `Dockerfile` (Node 18+ ile `npm run build` ve `npm run start`).
- `.env` prod değerleri container’a env veya secrets ile verilsin; image içine koymayın.
- MongoDB prod’da ayrı servis (Atlas veya ayrı container) kullanın.

### 3.4 Diğer Platformlar

- **Railway, Render, Fly.io**: Next.js destekleyen ortamlarda benzer şekilde env tanımlayıp build/start komutlarını kullanın.
- **Netlify**: Next.js için Netlify adapter gerekebilir; genelde Vercel daha sorunsuzdur.

---

## 4. Domain ve SSL

- Domain’i hosting sağlayıcısına (Vercel/DNS) yönlendirin.
- HTTPS zorunlu; `NEXTAUTH_URL` mutlaka `https://` ile başlasın.
- HTTP → HTTPS yönlendirmesini hosting veya reverse proxy ile yapın.

---

## 5. Post-Deploy Kontrol Listesi

- [ ] Ana sayfa ve statik sayfalar açılıyor.
- [ ] Kayıt / giriş (Credentials) çalışıyor.
- [ ] Google ile giriş (kullanıyorsanız) çalışıyor.
- [ ] Dashboard’da CV listesi geliyor.
- [ ] Yeni CV oluşturma ve düzenleme çalışıyor.
- [ ] PDF indirme sorunsuz.
- [ ] Paylaşım linki (`/cv/[token]`) çalışıyor.
- [ ] AI özellikleri (ATS, çeviri, iyileştirme) env doğruysa çalışıyor.
- [ ] Mobil görünüm ve temel erişilebilirlik kontrolü.

---

## 6. İzleme ve Bakım

- **Hata izleme**: Sentry veya benzeri bir servis ekleyin (client + server).
- **Loglama**: Prod log’ları merkezi toplayın (hosting log’ları, PM2 log, vb.).
- **Yedekleme**: MongoDB için Atlas backup veya düzenli snapshot.
- **Güncellemeler**: Bağımlılık güncellemeleri ve güvenlik yamaları için periyodik `npm audit` ve güncelleme planı.

---

## 7. Kısa Özet Zaman Çizelgesi

| Aşama | Yapılacaklar |
|-------|----------------|
| **1** | Env’leri listeleyin; NEXTAUTH_SECRET üretin; MongoDB (Atlas vb.) hazırlayın. |
| **2** | Google OAuth kullanacaksanız Console’da client oluşturup redirect URI ekleyin. |
| **3** | `npm run build` ve lokal `npm run start` ile test edin. |
| **4** | Vercel (veya seçtiğiniz platform) üzerinde proje oluşturup env’leri girin. |
| **5** | Deploy alın; NEXTAUTH_URL’i prod domain ile güncelleyin. |
| **6** | Domain + SSL ayarlarını yapın. |
| **7** | Yukarıdaki post-deploy maddelerini tek tek test edin. |
| **8** | İzleme (Sentry vb.) ve yedekleme stratejisini devreye alın. |

Bu yol haritası, uygulamanın prod ortama çıkışı için gerekli teknik adımları kapsar. Platform (Vercel / VPS / Docker) seçiminize göre ilgili bölümü uygulayabilirsiniz.
