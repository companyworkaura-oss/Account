import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const userCount = await prisma.user.count();
  if (userCount === 0) redirect('/signup');

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-white">Sign In</h1>
      <p className="mb-5 text-sm text-white/45">Welcome back to your workspace.</p>
      <LoginForm />
      <p className="mt-5 text-center text-xs text-white/40">
        Setting this up for the first time?{' '}
        <Link href="/signup" className="font-medium text-accent-400 hover:text-accent-300">
          Create the owner account
        </Link>
      </p>
    </div>
  );
}
