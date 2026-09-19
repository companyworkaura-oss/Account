import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id },
    include: {
      purchaseInvoices: { orderBy: { date: 'desc' } },
      payments: { orderBy: { date: 'desc' } },
    },
  });
  if (!vendor) notFound();

  const outstanding = vendor.purchaseInvoices.reduce((s, inv) => s + (inv.total - inv.amountPaid), 0);

  return (
    <div>
      <Link href="/ap/vendors" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to vendors
      </Link>

      <PageHeader
        title={vendor.name}
        breadcrumb={['Accounts Payable', 'Vendors']}
        description={vendor.email ?? undefined}
        actions={
          <div className="glass-card !p-3 text-right">
            <p className="text-xs text-white/40">Outstanding</p>
            <p className="text-lg font-semibold text-white">{formatCurrency(outstanding)}</p>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Purchase Invoices</div>
          <table className="table-shell">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th className="text-right">Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendor.purchaseInvoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/40">No invoices yet.</td>
                </tr>
              )}
              {vendor.purchaseInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-medium text-white">
                    <Link href={`/ap/purchase-invoices/${inv.id}`} className="hover:text-accent-400">{inv.invoiceNumber}</Link>
                  </td>
                  <td className="text-white/50">{formatDate(inv.date)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(inv.total)}</td>
                  <td><StatusPill status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="px-4 pt-4 text-sm font-semibold text-white">Payments</div>
          <table className="table-shell">
            <thead>
              <tr>
                <th>Payment #</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {vendor.payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/40">No payments yet.</td>
                </tr>
              )}
              {vendor.payments.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-white">{p.paymentNumber}</td>
                  <td className="text-white/50">{formatDate(p.date)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(p.amount)}</td>
                  <td className="text-white/50">{p.method.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
