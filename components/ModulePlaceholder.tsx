import { Construction, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui';

export function ModulePlaceholder({
  title,
  breadcrumb,
  description,
  features,
  icon: Icon = Construction,
}: {
  title: string;
  breadcrumb: string[];
  description: string;
  features: string[];
  icon?: LucideIcon;
}) {
  return (
    <div>
      <PageHeader
        title={title}
        breadcrumb={breadcrumb}
        description={description}
        actions={
          <span className="badge border border-amber-400/20 bg-amber-500/10 text-amber-300">
            Planned for next release
          </span>
        }
      />

      <div className="glass-card flex flex-col items-center gap-6 py-16 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-accent-400">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">This module is scaffolded and ready to build out</h2>
          <p className="mt-1.5 max-w-xl text-sm text-white/50">
            The navigation, layout, and data model for this area are wired up. Here&apos;s what will
            ship here:
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
