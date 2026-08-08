import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { upsertOAuthUser } from '@/services/userService';

/**
 * Read straight from process.env rather than getEnv(): provider construction
 * happens at module load, which also runs during `next build` where secrets are
 * absent. Startup validation lives in src/instrumentation.ts.
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleOAuth = Boolean(googleClientId && googleClientSecret);

/** Deliberately identical for unknown emails and wrong passwords. */
const INVALID_CREDENTIALS = 'Invalid email or password';

export const authOptions: AuthOptions = {
  providers: [
    ...(hasGoogleOAuth
      ? [
          GoogleProvider({
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await connectToDatabase();
        // `password` is `select: false` on the schema, so ask for it explicitly.
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select('+password');

        if (!user) throw new Error(INVALID_CREDENTIALS);

        if (!user.password) {
          // Account was created through an OAuth provider and has no local
          // password; without this hint the user has no way to recover.
          throw new Error('This account uses social sign-in. Continue with Google.');
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error(INVALID_CREDENTIALS);

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Credentials sign-in already resolved a local user in `authorize`.
      if (!account || account.provider === 'credentials') return true;

      if (!user.email) return false;
      await upsertOAuthUser({
        email: user.email,
        name: user.name,
        image: user.image,
        provider: account.provider,
      });
      return true;
    },

    async jwt({ token, user, account }) {
      // Only runs on initial sign-in; later calls reuse the persisted token.
      if (!user) return token;

      if (account && account.provider !== 'credentials' && user.email) {
        // The provider's account id is meaningless to our data model — every CV
        // is keyed by the Mongo ObjectId, so swap it in here.
        const dbUser = await upsertOAuthUser({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account.provider,
        });
        token.sub = dbUser._id.toString();
      } else {
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Never emit provider secrets or token payloads into production logs.
  debug: false,
};
