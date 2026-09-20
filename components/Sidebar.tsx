'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Home, Users as UsersIcon, Wallet } from 'lucide-react';
import { navGroups } from '@/lib/nav';
import { getIcon } from '@/components/icon-map';
import clsx from 'clsx';

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggle(label: string) {
    setCollapsed((c) => ({ ...c, [label]: !c[label] }));
  }

  return (
    <aside
      className={clsx(
        'z-40 w-72 shrink-0 flex-col gap-4 p-4 lg:flex',
        mobileOpen
          ? 'fixed inset-y-0 left-0 flex h-full overflow-y-auto bg-base-950/95 backdrop-blur-xl'
          : 'hidden'
      )}
    >
      <div className="glass-panel flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-[0_4px_16px_rgba(56,189,248,0.4)]">
          <Wallet className="h-5 w-5 text-base-950" strokeWidth={2.25} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight text-white">Account Suite</p>
          <p className="text-xs text-white/40">Local Workspace</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="icon-btn lg:hidden" aria-label="Close menu">
            ×
          </button>
        )}
      </div>

      <nav className="glass-panel flex-1 overflow-y-auto p-3">
        <Link
          href="/"
          onClick={onClose}
          className={clsx(
            'mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
            pathname === '/' ? 'bg-white/[0.09] text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
          )}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/settings/users"
          onClick={onClose}
          className={clsx(
            'mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
            pathname.startsWith('/settings/users') ? 'bg-white/[0.09] text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
          )}
        >
          <UsersIcon className="h-4 w-4" />
          Users
        </Link>

        <div className="my-2 h-px bg-white/10" />

        <div className="flex flex-col gap-1">
          {navGroups.map((group) => {
            const GroupIcon = getIcon(group.icon);
            const isCollapsed = collapsed[group.label];
            const groupActive = group.items.some((i) => pathname.startsWith(i.href));
            return (
              <div key={group.label}>
                <button
                  onClick={() => toggle(group.label)}
                  className={clsx(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition',
                    groupActive ? 'text-accent-400' : 'text-white/45 hover:text-white/70'
                  )}
                >
                  <GroupIcon className="h-4 w-4" />
                  <span className="flex-1">{group.label}</span>
                  <ChevronDown
                    className={clsx('h-3.5 w-3.5 transition-transform', isCollapsed && '-rotate-90')}
                  />
                </button>
                {!isCollapsed && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                    {group.items.map((item) => {
                      const active = pathname.startsWith(item.href) && (item.href !== '/' );
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={clsx(
                            'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                            active
                              ? 'bg-white/[0.09] text-white'
                              : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
                          )}
                        >
                          <span>{item.label}</span>
                          {item.status === 'planned' && (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" title="Coming soon" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="glass-panel px-4 py-3 text-xs text-white/35">
        Data stored locally on this PC.
        <br />
        Ready to publish when you are.
      </div>
    </aside>
  );
}
