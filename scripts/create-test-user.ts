import './load-env';
import { connectToDatabase } from '../src/lib/mongodb';
import User from '../src/models/User';
import { hash } from 'bcryptjs';

async function createTestUser() {
  try {
    console.log('MongoDB bağlantısı kuruluyor...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cv-builder';
    console.log('MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    await connectToDatabase();
    console.log('✅ MongoDB bağlantısı başarılı!');

    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    const testName = 'Test User';

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log('Test kullanıcısı zaten mevcut!');
      console.log('Email:', testEmail);
      console.log('Şifre:', testPassword);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hash(testPassword, 12);

    // Create user
    const user = new User({
      name: testName,
      email: testEmail,
      password: hashedPassword,
      cvLimit: 10, // Test için daha fazla CV limiti
    });

    await user.save();

    console.log('✅ Test kullanıcısı başarıyla oluşturuldu!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', testEmail);
    console.log('Şifre:', testPassword);
    console.log('İsim:', testName);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nBu bilgilerle giriş yapabilirsiniz:');
    console.log('http://localhost:3000/auth/login');
  } catch (error) {
    console.error('❌ Hata:', error);
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB bağlantı hatası!');
      console.error('Lütfen MongoDB\'nin çalıştığından emin olun:');
      console.error('  - MongoDB servisini başlatın: sudo systemctl start mongod');
      console.error('  - Veya MongoDB Compass/Atlas kullanıyorsanız bağlantı bilgilerini kontrol edin');
      console.error('  - .env dosyasında MONGODB_URI değişkenini kontrol edin');
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createTestUser();
