import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { NewTransferButton } from './TransferDialog';

export const dynamic = 'force-dynamic';

export default async function BankTransfersPage() {
  const [accounts, transfers] = await Promise.all([
    prisma.bankAccount.findMany({ orderBy: { name: 'asc' } }),
    prisma.bankTransfer.findMany({ include: { fromAccount: true, toAccount: true }, orderBy: { date: 'desc' } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Bank Transfers"
        breadcrumb={['Cash & Bank']}
        description="Move funds between your own bank and cash accounts."
        actions={<NewTransferButton accounts={accounts} />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th className="text-right">Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length === 0 && (
              <tr><td colSpan={5} className="py-10 text-center text-white/40">No transfers yet.</td></tr>
            )}
            {transfers.map((t) => (
              <tr key={t.id}>
                <td className="text-white/50">{formatDate(t.date)}</td>
                <td className="font-medium text-white">{t.fromAccount.name}</td>
                <td className="font-medium text-white">{t.toAccount.name}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(t.amount)}</td>
                <td className="text-white/50">{t.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
