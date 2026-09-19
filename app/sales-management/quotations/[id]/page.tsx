import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { QuotationActions } from './QuotationActions';

export const dynamic = 'force-dynamic';

export default async function QuotationDetailPage({ params }: { params: { id: string } }) {
  const quotation = await prisma.quotation.findUnique({ where: { id: params.id }, include: { customer: true, lines: true } });
  if (!quotation) notFound();

  return (
    <div>
      <Link href="/sales-management" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Sales Management
      </Link>

      <PageHeader
        title={quotation.quoteNumber}
        breadcrumb={['Inventory & Sales', 'Sales Management']}
        description={quotation.customer.name}
        actions={
          <>
            <StatusPill status={quotation.status} />
            <QuotationActions id={quotation.id} status={quotation.status} />
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Date</p><p className="mt-1 text-sm font-medium text-white">{formatDate(quotation.date)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Expiry</p><p className="mt-1 text-sm font-medium text-white">{formatDate(quotation.expiryDate)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Total</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(quotation.total)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Status</p><p className="mt-1 text-sm font-medium text-white">{quotation.status}</p></div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead><tr><th>Description</th><th className="text-right">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Amount</th></tr></thead>
          <tbody>
            {quotation.lines.map((l) => (
              <tr key={l.id}>
                <td className="text-white/80">{l.description}</td>
                <td className="text-right text-white/60">{l.quantity}</td>
                <td className="text-right font-mono text-white/60">{formatCurrency(l.unitPrice)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3} className="text-right text-white/50">Subtotal</td><td className="text-right font-mono text-white/80">{formatCurrency(quotation.subtotal)}</td></tr>
            <tr><td colSpan={3} className="text-right text-white/50">Tax</td><td className="text-right font-mono text-white/80">{formatCurrency(quotation.tax)}</td></tr>
            <tr><td colSpan={3} className="text-right font-semibold text-white">Total</td><td className="text-right font-mono font-semibold text-white">{formatCurrency(quotation.total)}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
