import { NextResponse } from 'next/server';
import { ApiError, handleApiError, readJson } from '@/lib/api';
import { clientIp, enforceRateLimit } from '@/lib/rate-limit';
import { registerSchema } from '@/lib/validation';
import { createCredentialsUser, findUserByEmail } from '@/services/userService';

export async function POST(request: Request) {
  try {
    enforceRateLimit('auth', clientIp(request));

    const { name, email, password } = registerSchema.parse(await readJson(request));

    if (await findUserByEmail(email)) {
      throw new ApiError(409, 'This email address is already in use', 'email_taken');
    }

    await createCredentialsUser({ name, email, password });

    // Never echo the created user back: the response would carry the hash.
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/auth/register');
  }
}
