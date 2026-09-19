'use client';

import { useTransition } from 'react';
import { toggleReconciled } from '../actions';

export function ReconcileCheckbox({ id, reconciled }: { id: string; reconciled: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <input
      type="checkbox"
      defaultChecked={reconciled}
      disabled={pending}
      onChange={(e) => startTransition(() => toggleReconciled(id, e.target.checked))}
      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-accent-500"
    />
  );
}
