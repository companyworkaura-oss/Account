import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { NewItemButton } from './ItemDialog';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const items = await prisma.item.findMany({ orderBy: { name: 'asc' } });
  const lowStockCount = items.filter((i) => i.quantityOnHand <= i.reorderLevel).length;
  const stockValue = items.reduce((s, i) => s + i.quantityOnHand * i.costPrice, 0);

  return (
    <div>
      <PageHeader
        title="Inventory / Stock Management"
        breadcrumb={['Inventory & Sales']}
        description="Track stock levels and valuation across all your items."
        actions={<NewItemButton />}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card"><p className="text-xs text-white/40">Items Tracked</p><p className="mt-1 text-xl font-semibold text-white">{items.length}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Stock Value (at cost)</p><p className="mt-1 text-xl font-semibold text-white">{formatCurrency(stockValue)}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Low Stock Items</p><p className={clsx('mt-1 text-xl font-semibold', lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400')}>{lowStockCount}</p></div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item</th>
              <th className="text-right">On Hand</th>
              <th className="text-right">Reorder Level</th>
              <th className="text-right">Unit Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-white/40">No items yet. Add your first item to start tracking stock.</td></tr>
            )}
            {items.map((i) => {
              const low = i.quantityOnHand <= i.reorderLevel;
              return (
                <tr key={i.id}>
                  <td className="font-mono text-white/60">{i.sku}</td>
                  <td className="font-medium text-white">
                    <Link href={`/inventory/${i.id}`} className="hover:text-accent-400">{i.name}</Link>
                  </td>
                  <td className="text-right font-mono text-white/80">{i.quantityOnHand} {i.unit}</td>
                  <td className="text-right font-mono text-white/50">{i.reorderLevel} {i.unit}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(i.unitPrice)}</td>
                  <td>
                    <span className={clsx('badge border', low ? 'border-amber-400/20 bg-amber-500/10 text-amber-300' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300')}>
                      {low ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
