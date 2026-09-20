import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LoginForm } from './LoginForm';
import { GoogleButton } from './GoogleButton';

export const dynamic = 'force-dynamic';

const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export default async function LoginPage() {
  const userCount = await prisma.user.count();
  if (userCount === 0) redirect('/signup');

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-white">Sign In</h1>
      <p className="mb-5 text-sm text-white/45">Welcome back to your workspace.</p>
      <LoginForm />
      {googleConfigured && (
        <>
          <div className="my-4 flex items-center gap-3 text-xs text-white/30">
            <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
          </div>
          <GoogleButton />
        </>
      )}
      <p className="mt-5 text-center text-xs text-white/40">
        Setting this up for the first time?{' '}
        <Link href="/signup" className="font-medium text-accent-400 hover:text-accent-300">
          Create the owner account
        </Link>
      </p>
    </div>
  );
}
