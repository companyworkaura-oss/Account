import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SignupForm } from './SignupForm';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const userCount = await prisma.user.count();
  if (userCount > 0) redirect('/login');

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-white">Create the Owner Account</h1>
      <p className="mb-5 text-sm text-white/45">This is the first setup step — you&apos;ll sign in with this from now on.</p>
      <SignupForm />
      <p className="mt-5 text-center text-xs text-white/40">
        Already set up?{' '}
        <Link href="/login" className="font-medium text-accent-400 hover:text-accent-300">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
