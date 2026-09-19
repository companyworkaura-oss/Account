import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumb && (
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/40">
            {breadcrumb.map((b, i) => (
              <span key={b} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {b}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-white/45">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = 'default',
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  tone?: 'default' | 'positive' | 'negative';
}) {
  return (
    <div className="glass-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">{label}</p>
        <div className="icon-btn !h-8 !w-8 text-accent-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {trend && (
        <p
          className={clsx(
            'mt-1.5 text-xs font-medium',
            tone === 'positive' && 'text-emerald-400',
            tone === 'negative' && 'text-red-400',
            tone === 'default' && 'text-white/40'
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-14 text-center">
      <p className="text-sm font-medium text-white/70">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-white/40">{description}</p>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    UNPAID: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    PARTIAL: 'bg-sky-500/15 text-sky-300 border-sky-400/20',
    OVERDUE: 'bg-red-500/15 text-red-300 border-red-400/20',
    POSTED: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    DRAFT: 'bg-white/10 text-white/60 border-white/15',
  };
  return (
    <span className={clsx('badge border', map[status] ?? 'border-white/15 text-white/60')}>
      {status}
    </span>
  );
}

export function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-accent-400 hover:text-accent-300">
      {children}
    </Link>
  );
}
