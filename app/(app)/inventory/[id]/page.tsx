import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { AdjustStockButton } from './AdjustStockDialog';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: { movements: { orderBy: { date: 'desc' } } },
  });
  if (!item) notFound();

  return (
    <div>
      <Link href="/inventory" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>

      <PageHeader
        title={item.name}
        breadcrumb={['Inventory & Sales', 'Inventory']}
        description={`SKU: ${item.sku}`}
        actions={<AdjustStockButton itemId={item.id} />}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card !p-4"><p className="text-xs text-white/40">On Hand</p><p className="mt-1 text-sm font-medium text-white">{item.quantityOnHand} {item.unit}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Reorder Level</p><p className="mt-1 text-sm font-medium text-white">{item.reorderLevel} {item.unit}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Cost Price</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(item.costPrice)}</p></div>
        <div className="glass-card !p-4"><p className="text-xs text-white/40">Selling Price</p><p className="mt-1 text-sm font-medium text-white">{formatCurrency(item.unitPrice)}</p></div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="px-4 pt-4 text-sm font-semibold text-white">Stock Movements</div>
        <table className="table-shell">
          <thead>
            <tr><th>Date</th><th>Type</th><th className="text-right">Quantity</th><th>Reference</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {item.movements.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-white/40">No stock movements yet.</td></tr>
            )}
            {item.movements.map((m) => (
              <tr key={m.id}>
                <td className="text-white/50">{formatDate(m.date)}</td>
                <td>
                  <span className={clsx('badge border', m.type === 'OUT' ? 'border-red-400/20 bg-red-500/10 text-red-300' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300')}>
                    {m.type}
                  </span>
                </td>
                <td className="text-right font-mono text-white/80">{m.type === 'OUT' ? '-' : '+'}{m.quantity}</td>
                <td className="text-white/50">{m.reference ?? '—'}</td>
                <td className="text-white/50">{m.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
