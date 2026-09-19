import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { OrderActions } from './OrderActions';

export const dynamic = 'force-dynamic';

export default async function SalesOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.salesOrder.findUnique({
    where: { id: params.id },
    include: { customer: true, lines: true, deliveryNotes: true },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/sales-management" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Sales Management
      </Link>

      <PageHeader
        title={order.orderNumber}
        breadcrumb={['Inventory & Sales', 'Sales Management']}
        description={order.customer.name}
        actions={
          <>
            <StatusPill status={order.status} />
            <OrderActions id={order.id} status={order.status} />
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Date</p><p className="mt-1 text-sm font-medium text-white">{formatDate(order.date)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Total</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(order.total)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Status</p><p className="mt-1 text-sm font-medium text-white">{order.status}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Delivery Notes</p><p className="mt-1 text-sm font-medium text-white">{order.deliveryNotes.length}</p></div>
      </div>

      <div className="glass-panel mb-4 overflow-hidden">
        <table className="table-shell">
          <thead><tr><th>Description</th><th className="text-right">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Amount</th></tr></thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.id}>
                <td className="text-white/80">{l.description}</td>
                <td className="text-right text-white/60">{l.quantity}</td>
                <td className="text-right font-mono text-white/60">{formatCurrency(l.unitPrice)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3} className="text-right text-white/50">Subtotal</td><td className="text-right font-mono text-white/80">{formatCurrency(order.subtotal)}</td></tr>
            <tr><td colSpan={3} className="text-right text-white/50">Tax</td><td className="text-right font-mono text-white/80">{formatCurrency(order.tax)}</td></tr>
            <tr><td colSpan={3} className="text-right font-semibold text-white">Total</td><td className="text-right font-mono font-semibold text-white">{formatCurrency(order.total)}</td></tr>
          </tfoot>
        </table>
      </div>

      {order.deliveryNotes.length > 0 && (
        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Delivery Notes</div>
          <table className="table-shell">
            <thead><tr><th>Delivery #</th><th>Date</th><th>Notes</th></tr></thead>
            <tbody>
              {order.deliveryNotes.map((d) => (
                <tr key={d.id}>
                  <td className="font-medium text-white">{d.deliveryNumber}</td>
                  <td className="text-white/50">{formatDate(d.date)}</td>
                  <td className="text-white/50">{d.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
