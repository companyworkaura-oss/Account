import { Wallet } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-[0_4px_16px_rgba(56,189,248,0.4)]">
            <Wallet className="h-6 w-6 text-base-950" strokeWidth={2.25} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-white">Account Suite</p>
            <p className="text-xs text-white/40">Local Workspace</p>
          </div>
        </div>
        <div className="glass-panel p-6">{children}</div>
      </div>
    </div>
  );
}
