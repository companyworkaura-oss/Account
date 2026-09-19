import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { RecordReceiptButton } from './ReceiptDialog';

export const dynamic = 'force-dynamic';

export default async function ReceiptsPage() {
  const [receipts, unpaidInvoices] = await Promise.all([
    prisma.receipt.findMany({ include: { customer: true, salesInvoice: true }, orderBy: { date: 'desc' } }),
    prisma.salesInvoice.findMany({ where: { status: { not: 'PAID' } }, include: { customer: true } }),
  ]);

  const invoiceOptions = unpaidInvoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerId: inv.customerId,
    customerName: inv.customer.name,
    balance: inv.total - inv.amountPaid,
  }));

  return (
    <div>
      <PageHeader
        title="Receipts"
        breadcrumb={['Accounts Receivable']}
        description="Payments received from customers against their invoices."
        actions={<RecordReceiptButton invoices={invoiceOptions} />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Customer</th>
              <th>Invoice</th>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-white/40">No receipts recorded yet.</td></tr>
            )}
            {receipts.map((r) => (
              <tr key={r.id}>
                <td className="font-medium text-white">{r.receiptNumber}</td>
                <td className="text-white/70">{r.customer.name}</td>
                <td className="text-white/50">{r.salesInvoice?.invoiceNumber ?? '—'}</td>
                <td className="text-white/50">{formatDate(r.date)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(r.amount)}</td>
                <td className="text-white/50">{r.method.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
