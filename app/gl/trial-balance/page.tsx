import { getTrialBalance } from '@/lib/reports';
import { PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function TrialBalancePage() {
  const rows = await getTrialBalance().then((r) => r.filter((a) => a.debitTotal > 0 || a.creditTotal > 0));

  const totalDebit = rows.reduce((s, r) => s + r.debitBalance, 0);
  const totalCredit = rows.reduce((s, r) => s + r.creditBalance, 0);

  return (
    <div>
      <PageHeader
        title="Trial Balance"
        breadcrumb={['General Ledger']}
        description="A summary of every account balance, verifying that total debits equal total credits."
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Code</th>
              <th>Account</th>
              <th>Type</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-white/40">
                  No activity posted yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-white/60">{r.code}</td>
                <td className="font-medium text-white">{r.name}</td>
                <td className="text-white/40">{r.type}</td>
                <td className="text-right font-mono text-white/80">{r.debitBalance ? formatCurrency(r.debitBalance) : '—'}</td>
                <td className="text-right font-mono text-white/80">{r.creditBalance ? formatCurrency(r.creditBalance) : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-semibold text-white">
                Totals
              </td>
              <td className="text-right font-mono font-semibold text-white">{formatCurrency(totalDebit)}</td>
              <td className="text-right font-mono font-semibold text-white">{formatCurrency(totalCredit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {rows.length > 0 && (
        <p className={`mt-3 text-sm ${Math.abs(totalDebit - totalCredit) < 0.01 ? 'text-emerald-400' : 'text-red-400'}`}>
          {Math.abs(totalDebit - totalCredit) < 0.01 ? 'Books are balanced.' : 'Warning: books are out of balance.'}
        </p>
      )}
    </div>
  );
}
