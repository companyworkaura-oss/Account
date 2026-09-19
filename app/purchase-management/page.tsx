import Link from 'next/link';
import { Plus, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { Tabs } from '@/components/Tabs';

export const dynamic = 'force-dynamic';

export default async function PurchaseManagementPage() {
  const orders = await prisma.purchaseOrder.findMany({ include: { vendor: true, goodsReceipts: true }, orderBy: { date: 'desc' } });

  const goodsReceipts = orders
    .flatMap((o) => o.goodsReceipts.map((g) => ({ ...g, poId: o.id, poNumber: o.poNumber, vendorName: o.vendor.name })))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div>
      <PageHeader
        title="Purchase Management"
        breadcrumb={['Inventory & Sales']}
        description="Purchase orders and goods receipts — from order to delivery."
      />

      <Tabs
        tabs={[
          {
            label: 'Purchase Orders',
            content: (
              <div>
                <div className="mb-4 flex justify-end">
                  <Link href="/purchase-management/new" className="btn-primary"><Plus className="h-4 w-4" /> New Purchase Order</Link>
                </div>
                <div className="glass-panel overflow-hidden">
                  <table className="table-shell">
                    <thead><tr><th>PO #</th><th>Vendor</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {orders.length === 0 && (<tr><td colSpan={5} className="py-10 text-center text-white/40">No purchase orders yet.</td></tr>)}
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="font-medium text-white"><Link href={`/purchase-management/${o.id}`} className="hover:text-accent-400">{o.poNumber}</Link></td>
                          <td className="text-white/70">{o.vendor.name}</td>
                          <td className="text-white/50">{formatDate(o.date)}</td>
                          <td className="text-right font-mono text-white/80">{formatCurrency(o.total)}</td>
                          <td><StatusPill status={o.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          },
          {
            label: 'Goods Receipts',
            content: (
              <div className="glass-panel overflow-hidden">
                <table className="table-shell">
                  <thead><tr><th>GR #</th><th>PO #</th><th>Vendor</th><th>Date</th></tr></thead>
                  <tbody>
                    {goodsReceipts.length === 0 && (
                      <tr><td colSpan={4} className="py-10 text-center text-white/40">No goods receipts yet — record one from a sent purchase order.</td></tr>
                    )}
                    {goodsReceipts.map((g) => (
                      <tr key={g.id}>
                        <td className="font-medium text-white">{g.grNumber}</td>
                        <td className="text-white/60"><Link href={`/purchase-management/${g.poId}`} className="hover:text-accent-400">{g.poNumber}</Link></td>
                        <td className="text-white/70">{g.vendorName}</td>
                        <td className="text-white/50">{formatDate(g.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            label: 'Supplier Management',
            content: (
              <div className="glass-card flex flex-col items-start gap-3">
                <p className="text-sm text-white/70">
                  Suppliers are managed under Accounts Payable → Vendor Management, so vendor data stays in one place
                  and lines up with your purchase invoices.
                </p>
                <Link href="/ap/vendors" className="btn-secondary">
                  <ArrowUpRight className="h-4 w-4" /> Go to Vendor Management
                </Link>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
