import { hash } from 'bcryptjs';
import { getEnv } from '@/lib/env';
import { connectToDatabase } from '@/lib/mongodb';
import User, { type UserDocument } from '@/models/User';

/** Mongo duplicate-key error, raised when two signups race on the same email. */
function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
}

export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return User.findOne({ email: email.toLowerCase().trim() });
}

export async function createCredentialsUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserDocument> {
  await connectToDatabase();
  const email = input.email.toLowerCase().trim();

  const user = new User({
    name: input.name.trim(),
    email,
    password: await hash(input.password, 12),
    authProviders: ['credentials'],
    cvLimit: getEnv().FREE_CV_LIMIT,
  });

  return user.save();
}

/**
 * Maps an OAuth identity onto a local user record.
 *
 * NextAuth's JWT strategy stores whatever id the provider hands back, but every
 * CV is keyed by a Mongo ObjectId — so an OAuth sign-in must resolve to a real
 * user document before the session id is usable.
 */
export async function upsertOAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
}): Promise<UserDocument> {
  await connectToDatabase();
  const email = input.email.toLowerCase().trim();

  const existing = await User.findOne({ email });
  if (existing) {
    let changed = false;
    if (!existing.authProviders.includes(input.provider)) {
      existing.authProviders.push(input.provider);
      changed = true;
    }
    if (input.image && existing.image !== input.image) {
      existing.image = input.image;
      changed = true;
    }
    if (changed) await existing.save();
    return existing;
  }

  try {
    return await User.create({
      email,
      name: input.name?.trim() || email.split('@')[0],
      image: input.image ?? undefined,
      authProviders: [input.provider],
      cvLimit: getEnv().FREE_CV_LIMIT,
    });
  } catch (error) {
    // Lost a race against a concurrent sign-in; the winner's document is valid.
    if (isDuplicateKeyError(error)) {
      const winner = await User.findOne({ email });
      if (winner) return winner;
    }
    throw error;
  }
}
