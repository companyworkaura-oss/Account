import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { NewBankAccountButton } from '../BankAccountDialog';
import { NewTransactionButton } from '../TransactionDialog';
import { DeleteTransactionButton } from '../DeleteTransactionButton';
import { getBankAccountBalance } from '@/lib/reports';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function CashTransactionsPage() {
  const accounts = await prisma.bankAccount.findMany({ orderBy: { name: 'asc' } });
  const transactions = await prisma.cashTransaction.findMany({
    include: { bankAccount: true },
    orderBy: { date: 'desc' },
  });
  const balances = await Promise.all(accounts.map((a) => getBankAccountBalance(a.id)));

  return (
    <div>
      <PageHeader
        title="Cash Transactions"
        breadcrumb={['Cash & Bank']}
        description="Deposits and withdrawals across all your cash and bank accounts."
        actions={
          <>
            <NewBankAccountButton />
            <NewTransactionButton accounts={accounts} />
          </>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.length === 0 && (
          <div className="glass-card sm:col-span-2 lg:col-span-3 text-center text-white/40">
            No accounts yet — add a bank or cash account to get started.
          </div>
        )}
        {accounts.map((a, i) => (
          <div key={a.id} className="glass-card">
            <p className="text-xs font-medium uppercase tracking-wide text-white/40">{a.name}</p>
            <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(balances[i])}</p>
            <p className="mt-1 text-xs text-white/40">{a.bankName ?? 'Cash'} {a.accountNumber ? `· ${a.accountNumber}` : ''}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Account</th>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th className="text-right">Amount</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-white/40">No transactions recorded yet.</td></tr>
            )}
            {transactions.map((t) => {
              const isIn = t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN';
              return (
                <tr key={t.id}>
                  <td className="font-medium text-white">{t.bankAccount.name}</td>
                  <td className="text-white/50">{formatDate(t.date)}</td>
                  <td className="text-white/60">{t.description ?? '—'}</td>
                  <td>
                    <span className={clsx('badge border', isIn ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-red-400/20 bg-red-500/10 text-red-300')}>
                      {t.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={clsx('text-right font-mono', isIn ? 'text-emerald-400' : 'text-red-400')}>
                    {isIn ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td><DeleteTransactionButton id={t.id} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
