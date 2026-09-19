'use client';

import { useState } from 'react';
import { signup } from './actions';

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={async (formData) => {
        setError(null);
        setSubmitting(true);
        try {
          await signup(formData);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Something went wrong');
          setSubmitting(false);
        }
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Your Name</label>
        <input name="name" className="glass-input" placeholder="Jane Doe" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
        <input name="email" type="email" required autoFocus className="glass-input" placeholder="you@company.com" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Password</label>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className="glass-input" placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Confirm Password</label>
        <input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="glass-input" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}
