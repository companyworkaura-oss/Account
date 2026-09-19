import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { RecordPaymentButton } from './PaymentDialog';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const [payments, unpaidInvoices] = await Promise.all([
    prisma.payment.findMany({ include: { vendor: true, purchaseInvoice: true }, orderBy: { date: 'desc' } }),
    prisma.purchaseInvoice.findMany({ where: { status: { not: 'PAID' } }, include: { vendor: true } }),
  ]);

  const invoiceOptions = unpaidInvoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    vendorId: inv.vendorId,
    vendorName: inv.vendor.name,
    balance: inv.total - inv.amountPaid,
  }));

  return (
    <div>
      <PageHeader
        title="Payment Processing"
        breadcrumb={['Accounts Payable']}
        description="Record and track payments made to vendors."
        actions={<RecordPaymentButton invoices={invoiceOptions} />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Payment #</th>
              <th>Vendor</th>
              <th>Invoice</th>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-white/40">No payments recorded yet.</td>
              </tr>
            )}
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="font-medium text-white">{p.paymentNumber}</td>
                <td className="text-white/70">{p.vendor.name}</td>
                <td className="text-white/50">{p.purchaseInvoice?.invoiceNumber ?? '—'}</td>
                <td className="text-white/50">{formatDate(p.date)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(p.amount)}</td>
                <td className="text-white/50">{p.method.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
