import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { effectiveStatus } from '@/lib/invoice';

export const dynamic = 'force-dynamic';

export default async function PurchaseInvoicesPage() {
  const invoices = await prisma.purchaseInvoice.findMany({
    include: { vendor: true },
    orderBy: { date: 'desc' },
  });

  return (
    <div>
      <PageHeader
        title="Purchase Invoices"
        breadcrumb={['Accounts Payable']}
        description="Bills received from vendors, tracked from issue to payment."
        actions={
          <Link href="/ap/purchase-invoices/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New Purchase Invoice
          </Link>
        }
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Due</th>
              <th className="text-right">Total</th>
              <th className="text-right">Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-white/40">
                  No purchase invoices yet.
                </td>
              </tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-medium text-white">
                  <Link href={`/ap/purchase-invoices/${inv.id}`} className="hover:text-accent-400">
                    {inv.invoiceNumber}
                  </Link>
                </td>
                <td className="text-white/70">{inv.vendor.name}</td>
                <td className="text-white/50">{formatDate(inv.date)}</td>
                <td className="text-white/50">{formatDate(inv.dueDate)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(inv.total)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(inv.total - inv.amountPaid)}</td>
                <td>
                  <StatusPill status={effectiveStatus(inv.status, inv.dueDate, inv.amountPaid, inv.total)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
