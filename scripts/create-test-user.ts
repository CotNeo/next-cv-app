import './load-env';
import { connectToDatabase, disconnectFromDatabase } from '../src/lib/mongodb';
import { createCredentialsUser, findUserByEmail } from '../src/services/userService';
import User from '../src/models/User';

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test123456';
const TEST_NAME = 'Test User';
const TEST_CV_LIMIT = 10;

// Only Mongo is touched here, but connectToDatabase resolves the validated
// environment — provide a throwaway value so the script runs without the real
// auth secret in scope.
process.env.NEXTAUTH_SECRET ||= 'local-script-placeholder-secret-value';

async function main() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/cv-builder';
  console.log('Connecting to MongoDB:', uri.replace(/\/\/[^@]*@/, '//***:***@'));
  await connectToDatabase();
  console.log('✅ Connected');

  const existing = await findUserByEmail(TEST_EMAIL);
  if (existing) {
    console.log('Test user already exists.');
  } else {
    const user = await createCredentialsUser({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await User.updateOne({ _id: user._id }, { $set: { cvLimit: TEST_CV_LIMIT } });
    console.log('✅ Test user created');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email:   ', TEST_EMAIL);
  console.log('Password:', TEST_PASSWORD);
  console.log('CV limit:', TEST_CV_LIMIT);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Sign in at http://localhost:3000/auth/login');
}

main()
  .catch((error) => {
    console.error('❌ Failed:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      console.error('   Is MongoDB running, and is MONGODB_URI set in .env.local?');
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
