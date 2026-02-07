# Test Kullanıcısı Bilgileri

Test için kullanabileceğiniz kullanıcı bilgileri:

## Kullanıcı Bilgileri

- **Email:** `test@example.com`
- **Şifre:** `test123456`
- **İsim:** `Test User`

## Kullanıcı Oluşturma

### Yöntem 1: Script ile (MongoDB çalışıyorsa)

```bash
npm run create-test-user
```

### Yöntem 2: Register API ile (Server çalışıyorsa)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123456"}'
```

### Yöntem 3: Web Arayüzü ile

1. http://localhost:3000/auth/register adresine gidin
2. Yukarıdaki bilgileri kullanarak kayıt olun

## Notlar

- MongoDB'nin çalıştığından emin olun.
- Eğer kullanıcı zaten varsa, script hata vermeden mevcut bilgileri gösterecektir.
- Test kullanıcısı 10 CV limiti ile oluşturulur (normal kullanıcılar 1 CV ile başlar).
- Vercel/Preview’da test için env’ler Dashboard’da tanımlı olmalı; yerel script deploy ortamında çalışmaz, Yöntem 2 veya 3 kullanın.
