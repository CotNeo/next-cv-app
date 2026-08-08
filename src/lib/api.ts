import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';
import { authOptions } from '@/lib/auth';
import { ApiError, Unauthorized, BadRequest } from '@/lib/errors';

export {
  ApiError,
  Unauthorized,
  Forbidden,
  NotFound,
  BadRequest,
  ServiceUnavailable,
} from '@/lib/errors';

export interface ApiErrorBody {
  error: string;
  code: string;
  details?: Record<string, string[]>;
}

function errorResponse(
  status: number,
  code: string,
  error: string,
  details?: Record<string, string[]>
) {
  const body: ApiErrorBody = { error, code };
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

/**
 * Single exit point for route handlers. Known failures keep their status and
 * message; everything else is logged with context and reported as a generic 500
 * so stack traces and driver messages never reach the client.
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  if (error instanceof ApiError) {
    return errorResponse(error.status, error.code, error.message);
  }

  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const key = issue.path.join('.') || '_';
      (details[key] ??= []).push(issue.message);
    }
    return errorResponse(400, 'validation_failed', 'Invalid request body', details);
  }

  console.error(`[${context}]`, error);
  return errorResponse(500, 'internal_error', 'An unexpected error occurred');
}

/** Resolves the signed-in user's id or throws a 401 ApiError. */
export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw Unauthorized();
  return session.user.id;
}

/** Parses a JSON body, turning malformed payloads into a 400 instead of a 500. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw BadRequest('Request body must be valid JSON', 'invalid_json');
  }
}
