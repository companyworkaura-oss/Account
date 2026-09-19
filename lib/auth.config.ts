import type { NextAuthConfig } from 'next-auth';

// Edge-safe config: no Prisma or bcrypt here, since middleware runs on the
// Edge runtime and can't use them. The actual credential check lives in
// lib/auth.ts, which runs in the Node.js runtime (server actions, route
// handlers, server components).
export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  // Needed to self-host in production (npm run start) behind a plain host
  // header, e.g. on your own PC or a VPS. Hosts like Vercel set this
  // automatically, but it doesn't hurt to have it set explicitly everywhere.
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isPublicPath = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/auth');

      if (!isLoggedIn && !isPublicPath) return false;
      if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
        return Response.redirect(new URL('/', request.nextUrl.origin));
      }
      return true;
    },
  },
};
