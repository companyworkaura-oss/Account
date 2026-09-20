import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';

const providers: NonNullable<NextAuthConfig['providers']> = [
  Credentials({
    credentials: {
      email: { label: 'Email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      const email = typeof credentials?.email === 'string' ? credentials.email.toLowerCase().trim() : '';
      const password = typeof credentials?.password === 'string' ? credentials.password : '';
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name ?? undefined };
    },
  }),
];

// Google sign-in is optional — only wired up once AUTH_GOOGLE_ID/SECRET are
// set (see README). Without them, the app just runs on email/password.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google({}));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Credentials already checked the password in authorize() above.
      // Google only gets in if that email was already added under Users —
      // there's still no open sign-up, Google is just another way to log
      // into an account someone already created for you.
      if (account?.provider === 'google') {
        if (!user.email) return false;
        const existing = await prisma.user.findUnique({ where: { email: user.email.toLowerCase() } });
        return !!existing;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});
