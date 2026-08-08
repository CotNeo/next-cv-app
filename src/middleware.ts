import { withAuth } from 'next-auth/middleware';

/**
 * Server-side gate for authenticated areas. The pages also check the session
 * client-side for UX, but this is what actually keeps an unauthenticated
 * request from reaching them.
 */
export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
