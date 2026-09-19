'use client';

import { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <header className="glass-panel flex items-center gap-3 px-4 py-3.5">
          <button
            className="icon-btn lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-white/40">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search invoices, vendors, accounts..."
              className="w-full bg-transparent text-sm outline-none placeholder-white/30"
            />
          </div>

          <button className="icon-btn">
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3.5 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-semibold text-base-950">
              MC
            </div>
            <span className="text-sm text-white/80">My Company</span>
          </div>
        </header>

        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
