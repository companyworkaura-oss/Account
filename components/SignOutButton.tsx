'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/auth-actions';

export function SignOutButton() {
  return (
    <button className="icon-btn" title="Sign out" onClick={() => logout()}>
      <LogOut className="h-4 w-4" />
    </button>
  );
}
