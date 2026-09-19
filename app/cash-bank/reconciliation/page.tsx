import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { ReconcileCheckbox } from './ReconcileCheckbox';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReconciliationPage({ searchParams }: { searchParams: { account?: string } }) {
  const accounts = await prisma.bankAccount.findMany({ orderBy: { name: 'asc' } });
  const activeAccountId = searchParams.account ?? accounts[0]?.id;

  const transactions = activeAccountId
    ? await prisma.cashTransaction.findMany({
        where: { bankAccountId: activeAccountId },
        orderBy: { date: 'desc' },
      })
    : [];

  const reconciledTotal = transactions.filter((t) => t.reconciled).reduce((s, t) => s + (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' ? t.amount : -t.amount), 0);
  const unreconciledTotal = transactions.filter((t) => !t.reconciled).reduce((s, t) => s + (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN' ? t.amount : -t.amount), 0);

  return (
    <div>
      <PageHeader
        title="Bank Reconciliation"
        breadcrumb={['Cash & Bank']}
        description="Match your recorded transactions against your bank statement."
      />

      {accounts.length === 0 ? (
        <div className="glass-card text-center text-white/40">Add a bank account under Cash Transactions first.</div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {accounts.map((a) => (
              <Link
                key={a.id}
                href={`/cash-bank/reconciliation?account=${a.id}`}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  a.id === activeAccountId ? 'border-accent-500/40 bg-accent-500/10 text-accent-300' : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                }`}
              >
                {a.name}
              </Link>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="glass-card">
              <p className="text-xs text-white/40">Reconciled Balance</p>
              <p className="mt-1 text-xl font-semibold text-emerald-400">{formatCurrency(reconciledTotal)}</p>
            </div>
            <div className="glass-card">
              <p className="text-xs text-white/40">Unreconciled Movement</p>
              <p className="mt-1 text-xl font-semibold text-amber-400">{formatCurrency(unreconciledTotal)}</p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <table className="table-shell">
              <thead>
                <tr>
                  <th className="w-12">Done</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-white/40">No transactions on this account yet.</td></tr>
                )}
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td><ReconcileCheckbox id={t.id} reconciled={t.reconciled} /></td>
                    <td className="text-white/50">{formatDate(t.date)}</td>
                    <td className="text-white/60">{t.description ?? '—'}</td>
                    <td className="text-white/50">{t.type.replace('_', ' ')}</td>
                    <td className="text-right font-mono text-white/80">{formatCurrency(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
