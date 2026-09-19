import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { POActions } from './POActions';

export const dynamic = 'force-dynamic';

export default async function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: params.id },
    include: { vendor: true, lines: true, goodsReceipts: true },
  });
  if (!po) notFound();

  return (
    <div>
      <Link href="/purchase-management" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Purchase Management
      </Link>

      <PageHeader
        title={po.poNumber}
        breadcrumb={['Inventory & Sales', 'Purchase Management']}
        description={po.vendor.name}
        actions={
          <>
            <StatusPill status={po.status} />
            <POActions id={po.id} status={po.status} />
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Date</p><p className="mt-1 text-sm font-medium text-white">{formatDate(po.date)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Total</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(po.total)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Status</p><p className="mt-1 text-sm font-medium text-white">{po.status}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Goods Receipts</p><p className="mt-1 text-sm font-medium text-white">{po.goodsReceipts.length}</p></div>
      </div>

      <div className="glass-panel mb-4 overflow-hidden">
        <table className="table-shell">
          <thead><tr><th>Description</th><th className="text-right">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Amount</th></tr></thead>
          <tbody>
            {po.lines.map((l) => (
              <tr key={l.id}>
                <td className="text-white/80">{l.description}</td>
                <td className="text-right text-white/60">{l.quantity}</td>
                <td className="text-right font-mono text-white/60">{formatCurrency(l.unitPrice)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3} className="text-right text-white/50">Subtotal</td><td className="text-right font-mono text-white/80">{formatCurrency(po.subtotal)}</td></tr>
            <tr><td colSpan={3} className="text-right text-white/50">Tax</td><td className="text-right font-mono text-white/80">{formatCurrency(po.tax)}</td></tr>
            <tr><td colSpan={3} className="text-right font-semibold text-white">Total</td><td className="text-right font-mono font-semibold text-white">{formatCurrency(po.total)}</td></tr>
          </tfoot>
        </table>
      </div>

      {po.goodsReceipts.length > 0 && (
        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Goods Receipts</div>
          <table className="table-shell">
            <thead><tr><th>GR #</th><th>Date</th><th>Notes</th></tr></thead>
            <tbody>
              {po.goodsReceipts.map((g) => (
                <tr key={g.id}>
                  <td className="font-medium text-white">{g.grNumber}</td>
                  <td className="text-white/50">{formatDate(g.date)}</td>
                  <td className="text-white/50">{g.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
