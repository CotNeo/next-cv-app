/**
 * Runs once when the server boots. Validating the environment here means a
 * misconfigured deployment fails immediately and loudly, instead of surfacing as
 * a confusing 500 on the first request that happens to need a secret.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { validateEnv } = await import('@/lib/env');
  validateEnv();
}
