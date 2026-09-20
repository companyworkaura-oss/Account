import Link from 'next/link';
import { SignupForm } from './SignupForm';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-white">Create an Account</h1>
      <p className="mb-5 text-sm text-white/45">Sign up to start using the workspace.</p>
      <SignupForm />
      <p className="mt-5 text-center text-xs text-white/40">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent-400 hover:text-accent-300">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
