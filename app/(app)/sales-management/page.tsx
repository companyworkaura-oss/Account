import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { Tabs } from '@/components/Tabs';

export const dynamic = 'force-dynamic';

export default async function SalesManagementPage() {
  const [quotations, orders] = await Promise.all([
    prisma.quotation.findMany({ include: { customer: true }, orderBy: { date: 'desc' } }),
    prisma.salesOrder.findMany({ include: { customer: true, deliveryNotes: true }, orderBy: { date: 'desc' } }),
  ]);

  const deliveryNotes = orders
    .flatMap((o) => o.deliveryNotes.map((d) => ({ ...d, orderId: o.id, orderNumber: o.orderNumber, customerName: o.customer.name })))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div>
      <PageHeader
        title="Sales Management"
        breadcrumb={['Inventory & Sales']}
        description="Quotations, sales orders, and delivery notes — from quote to delivery."
      />

      <Tabs
        tabs={[
          {
            label: 'Quotations',
            content: (
              <div>
                <div className="mb-4 flex justify-end">
                  <Link href="/sales-management/quotations/new" className="btn-primary"><Plus className="h-4 w-4" /> New Quotation</Link>
                </div>
                <div className="glass-panel overflow-hidden">
                  <table className="table-shell">
                    <thead><tr><th>Quote #</th><th>Customer</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {quotations.length === 0 && (<tr><td colSpan={5} className="py-10 text-center text-white/40">No quotations yet.</td></tr>)}
                      {quotations.map((q) => (
                        <tr key={q.id}>
                          <td className="font-medium text-white"><Link href={`/sales-management/quotations/${q.id}`} className="hover:text-accent-400">{q.quoteNumber}</Link></td>
                          <td className="text-white/70">{q.customer.name}</td>
                          <td className="text-white/50">{formatDate(q.date)}</td>
                          <td className="text-right font-mono text-white/80">{formatCurrency(q.total)}</td>
                          <td><StatusPill status={q.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          },
          {
            label: 'Sales Orders',
            content: (
              <div>
                <div className="mb-4 flex justify-end">
                  <Link href="/sales-management/orders/new" className="btn-primary"><Plus className="h-4 w-4" /> New Sales Order</Link>
                </div>
                <div className="glass-panel overflow-hidden">
                  <table className="table-shell">
                    <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th className="text-right">Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {orders.length === 0 && (<tr><td colSpan={5} className="py-10 text-center text-white/40">No sales orders yet.</td></tr>)}
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="font-medium text-white"><Link href={`/sales-management/orders/${o.id}`} className="hover:text-accent-400">{o.orderNumber}</Link></td>
                          <td className="text-white/70">{o.customer.name}</td>
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
            label: 'Delivery Notes',
            content: (
              <div className="glass-panel overflow-hidden">
                <table className="table-shell">
                  <thead><tr><th>Delivery #</th><th>Order #</th><th>Customer</th><th>Date</th></tr></thead>
                  <tbody>
                    {deliveryNotes.length === 0 && (
                      <tr><td colSpan={4} className="py-10 text-center text-white/40">No delivery notes yet — create one from a confirmed sales order.</td></tr>
                    )}
                    {deliveryNotes.map((d) => (
                      <tr key={d.id}>
                        <td className="font-medium text-white">{d.deliveryNumber}</td>
                        <td className="text-white/60"><Link href={`/sales-management/orders/${d.orderId}`} className="hover:text-accent-400">{d.orderNumber}</Link></td>
                        <td className="text-white/70">{d.customerName}</td>
                        <td className="text-white/50">{formatDate(d.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
