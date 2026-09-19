'use client';

import { useState, useTransition } from 'react';
import { saveBudget } from './actions';

export function BudgetInput({ accountId, year, initial }: { accountId: string; year: number; initial: number }) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="number"
      min={0}
      step="0.01"
      value={value}
      disabled={pending}
      onChange={(e) => setValue(Number(e.target.value) || 0)}
      onBlur={() => startTransition(() => saveBudget(accountId, year, value))}
      className="glass-input text-right"
    />
  );
}
