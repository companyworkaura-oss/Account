import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { effectiveStatus } from '@/lib/invoice';
import { RecordReceiptButton } from '@/app/ar/receipts/ReceiptDialog';

export const dynamic = 'force-dynamic';

export default async function SalesInvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await prisma.salesInvoice.findUnique({
    where: { id: params.id },
    include: { customer: true, lines: true, receipts: true },
  });
  if (!invoice) notFound();

  const balance = invoice.total - invoice.amountPaid;
  const status = effectiveStatus(invoice.status, invoice.dueDate, invoice.amountPaid, invoice.total);

  return (
    <div>
      <Link href="/ar/sales-invoices" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to sales invoices
      </Link>

      <PageHeader
        title={invoice.invoiceNumber}
        breadcrumb={['Accounts Receivable', 'Sales Invoices']}
        description={invoice.customer.name}
        actions={
          <>
            <StatusPill status={status} />
            {balance > 0.01 && (
              <RecordReceiptButton
                label="Record Receipt"
                invoices={[{ id: invoice.id, invoiceNumber: invoice.invoiceNumber, customerId: invoice.customerId, customerName: invoice.customer.name, balance }]}
                presetInvoiceId={invoice.id}
              />
            )}
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Date</p><p className="mt-1 text-sm font-medium text-white">{formatDate(invoice.date)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Due Date</p><p className="mt-1 text-sm font-medium text-white">{formatDate(invoice.dueDate)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Total</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(invoice.total)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Balance Due</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(balance)}</p></div>
      </div>

      <div className="glass-panel mb-4 overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr><th>Description</th><th className="text-right">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Amount</th></tr>
          </thead>
          <tbody>
            {invoice.lines.map((l) => (
              <tr key={l.id}>
                <td className="text-white/80">{l.description}</td>
                <td className="text-right text-white/60">{l.quantity}</td>
                <td className="text-right font-mono text-white/60">{formatCurrency(l.unitPrice)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3} className="text-right text-white/50">Subtotal</td><td className="text-right font-mono text-white/80">{formatCurrency(invoice.subtotal)}</td></tr>
            <tr><td colSpan={3} className="text-right text-white/50">Tax</td><td className="text-right font-mono text-white/80">{formatCurrency(invoice.tax)}</td></tr>
            <tr><td colSpan={3} className="text-right font-semibold text-white">Total</td><td className="text-right font-mono font-semibold text-white">{formatCurrency(invoice.total)}</td></tr>
          </tfoot>
        </table>
      </div>

      {invoice.receipts.length > 0 && (
        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Receipts Applied</div>
          <table className="table-shell">
            <thead><tr><th>Receipt #</th><th>Date</th><th className="text-right">Amount</th></tr></thead>
            <tbody>
              {invoice.receipts.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-white">{r.receiptNumber}</td>
                  <td className="text-white/50">{formatDate(r.date)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
