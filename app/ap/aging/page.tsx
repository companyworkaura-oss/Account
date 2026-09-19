import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { agingBucket } from '@/lib/invoice';

export const dynamic = 'force-dynamic';

const BUCKETS = ['0-30', '31-60', '61-90', '90+'] as const;

export default async function APAgingPage() {
  const invoices = await prisma.purchaseInvoice.findMany({
    where: { status: { not: 'PAID' } },
    include: { vendor: true },
    orderBy: { dueDate: 'asc' },
  });

  const totals: Record<string, number> = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
  const rows = invoices.map((inv) => {
    const balance = inv.total - inv.amountPaid;
    const bucket = agingBucket(inv.dueDate);
    totals[bucket] += balance;
    return { ...inv, balance, bucket };
  });
  const grandTotal = BUCKETS.reduce((s, b) => s + totals[b], 0);

  return (
    <div>
      <PageHeader title="AP Aging Report" breadcrumb={['Accounts Payable']} description="Outstanding vendor balances grouped by days past due." />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {BUCKETS.map((b) => (
          <div key={b} className="glass-card">
            <p className="text-xs text-white/40">{b} days</p>
            <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(totals[b])}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Invoice #</th>
              <th>Due Date</th>
              <th>Bucket</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="py-10 text-center text-white/40">No outstanding vendor balances.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-medium text-white">{r.vendor.name}</td>
                <td className="text-white/60">{r.invoiceNumber}</td>
                <td className="text-white/50">{formatDate(r.dueDate)}</td>
                <td className="text-white/50">{r.bucket}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(r.balance)}</td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4} className="text-right font-semibold text-white">Total Outstanding</td>
                <td className="text-right font-mono font-semibold text-white">{formatCurrency(grandTotal)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
