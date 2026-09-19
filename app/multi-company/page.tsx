import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { NewCompanyButton, SetActiveButton, DeleteCompanyButton } from './CompanyDialog';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function MultiCompanyPage() {
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  return (
    <div>
      <PageHeader
        title="Multi-Company Management"
        breadcrumb={['Advanced / Optional']}
        description="Manage company profiles you work with, and switch which one is active."
        actions={<NewCompanyButton />}
      />

      <div className="mb-4 glass-card !p-4 text-xs text-white/45">
        Note: this manages company <em>profiles</em> (name, currency, tax ID) and lets you mark one as active. Full
        per-company data separation for ledgers/invoices/etc. is a bigger change and isn&apos;t wired up yet — all
        transactions currently share one set of books regardless of which company is active.
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr><th>Company</th><th>Currency</th><th>Tax ID</th><th>Status</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {companies.length === 0 && (
              <tr><td colSpan={5} className="py-10 text-center text-white/40">No companies yet. Add your first company profile.</td></tr>
            )}
            {companies.map((c) => (
              <tr key={c.id}>
                <td className="font-medium text-white">{c.name}</td>
                <td className="text-white/50">{c.currency}</td>
                <td className="text-white/50">{c.taxId ?? '—'}</td>
                <td>
                  <span className={clsx('badge border', c.isActive ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-white/40')}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    {!c.isActive && <SetActiveButton id={c.id} />}
                    <DeleteCompanyButton id={c.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
