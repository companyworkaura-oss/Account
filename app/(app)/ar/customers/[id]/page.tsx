import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      salesInvoices: { orderBy: { date: 'desc' } },
      receipts: { orderBy: { date: 'desc' } },
    },
  });
  if (!customer) notFound();

  const outstanding = customer.salesInvoices.reduce((s, inv) => s + (inv.total - inv.amountPaid), 0);

  return (
    <div>
      <Link href="/ar/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        breadcrumb={['Accounts Receivable', 'Customers']}
        description={customer.email ?? undefined}
        actions={
          <div className="glass-card !p-3 text-right">
            <p className="text-xs text-white/40">Outstanding</p>
            <p className="text-lg font-semibold text-white">{formatCurrency(outstanding)}</p>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Sales Invoices</div>
          <table className="table-shell">
            <thead><tr><th>Invoice #</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
            <tbody>
              {customer.salesInvoices.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-white/40">No invoices yet.</td></tr>
              )}
              {customer.salesInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-medium text-white"><Link href={`/ar/sales-invoices/${inv.id}`} className="hover:text-accent-400">{inv.invoiceNumber}</Link></td>
                  <td className="text-white/50">{formatDate(inv.date)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(inv.total)}</td>
                  <td><StatusPill status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Receipts</div>
          <table className="table-shell">
            <thead><tr><th>Receipt #</th><th>Date</th><th className="text-right">Amount</th><th>Method</th></tr></thead>
            <tbody>
              {customer.receipts.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-white/40">No receipts yet.</td></tr>
              )}
              {customer.receipts.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-white">{r.receiptNumber}</td>
                  <td className="text-white/50">{formatDate(r.date)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(r.amount)}</td>
                  <td className="text-white/50">{r.method.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
