# MongoDB Setup for Test User Creation

MongoDB authentication gerekiyor. Test kullanıcısı oluşturmak için aşağıdaki adımları izleyin.

**Vercel / Preview ortamı:** Deploy edilen ortamda test kullanıcısı için `MONGODB_URI` ve diğer env’leri Vercel Dashboard → Project → Settings → Environment Variables üzerinden tanımlayın; script sadece yerel çalıştırma içindir.

## Seçenek 1: MongoDB Authentication ile

1. MongoDB kullanıcı adı ve şifrenizi `.env.local` dosyasına ekleyin:

```env
MONGODB_URI=mongodb://username:password@localhost:27017/cv-builder
```

2. Script'i çalıştırın:

```bash
npm run create-test-user
```

## Seçenek 2: MongoDB Authentication Olmadan

MongoDB'de authentication'ı geçici olarak devre dışı bırakın:

1. MongoDB config dosyasını düzenleyin (`/etc/mongod.conf` veya MongoDB Atlas ayarları)
2. Authentication'ı kaldırın
3. MongoDB'yi yeniden başlatın
4. Script'i çalıştırın

## Seçenek 3: MongoDB'de Admin Kullanıcısı Oluşturma

MongoDB shell'de:

```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "your-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
```

Sonra `.env.local` dosyasını güncelleyin:

```env
MONGODB_URI=mongodb://admin:your-password@localhost:27017/cv-builder
```

## Test Kullanıcısı Bilgileri

Oluşturulacak test kullanıcısı:
- **Email:** `test@example.com`
- **Şifre:** `test123456`
- **İsim:** `Test User`
