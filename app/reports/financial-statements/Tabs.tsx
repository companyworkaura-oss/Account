'use client';

import { useState } from 'react';
import clsx from 'clsx';

export function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="glass-panel mb-4 inline-flex gap-1 p-1">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={clsx(
              'rounded-2xl px-4 py-2 text-sm font-medium transition',
              active === i ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white/70'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
}
