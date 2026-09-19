'use client';

import { useState } from 'react';
import { login } from './actions';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={async (formData) => {
        setError(null);
        setSubmitting(true);
        try {
          await login(formData);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Something went wrong');
          setSubmitting(false);
        }
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
        <input name="email" type="email" required autoFocus className="glass-input" placeholder="you@company.com" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Password</label>
        <input name="password" type="password" required autoComplete="current-password" className="glass-input" placeholder="••••••••" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
