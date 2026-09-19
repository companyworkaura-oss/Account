import { Fragment } from 'react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { NewAccountButton, EditAccountButton } from './AccountDialog';
import { DeleteAccountButton } from './DeleteAccountButton';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

const TYPE_ORDER = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
const TYPE_LABEL: Record<string, string> = {
  ASSET: 'Assets',
  LIABILITY: 'Liabilities',
  EQUITY: 'Equity',
  REVENUE: 'Revenue',
  EXPENSE: 'Expenses',
};

export default async function ChartOfAccountsPage() {
  const accounts = await prisma.account.findMany({ orderBy: { code: 'asc' } });

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    accounts: accounts.filter((a) => a.type === type),
  })).filter((g) => g.accounts.length > 0);

  return (
    <div>
      <PageHeader
        title="Chart of Accounts"
        breadcrumb={['General Ledger']}
        description="The master list of accounts used to record every transaction."
        actions={<NewAccountButton />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Sub-type</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-white/40">
                  No accounts yet. Add your first account to get started.
                </td>
              </tr>
            )}
            {grouped.map((group) => (
              <Fragment key={group.type}>
                <tr className="bg-white/[0.02] hover:bg-white/[0.02]">
                  <td colSpan={5} className="!border-b-0 py-2 text-xs font-semibold uppercase tracking-wide text-accent-400">
                    {TYPE_LABEL[group.type]}
                  </td>
                </tr>
                {group.accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="font-mono text-white/60">{acc.code}</td>
                    <td className="font-medium text-white">{acc.name}</td>
                    <td className="text-white/50">{acc.subType ?? '—'}</td>
                    <td>
                      <span
                        className={clsx(
                          'badge border',
                          acc.isActive
                            ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                            : 'border-white/10 text-white/40'
                        )}
                      >
                        {acc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <EditAccountButton account={acc} />
                        <DeleteAccountButton id={acc.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
