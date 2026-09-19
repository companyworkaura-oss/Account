import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { NewVendorButton, EditVendorButton } from './VendorDialog';
import { DeleteVendorButton } from './DeleteVendorButton';
import { formatCurrency } from '@/lib/format';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({
    include: { purchaseInvoices: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <PageHeader
        title="Vendor Management"
        breadcrumb={['Accounts Payable']}
        description="Manage the suppliers you purchase goods and services from."
        actions={<NewVendorButton />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Contact</th>
              <th className="text-right">Outstanding</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-white/40">
                  No vendors yet. Add your first vendor to get started.
                </td>
              </tr>
            )}
            {vendors.map((v) => {
              const outstanding = v.purchaseInvoices.reduce((s, inv) => s + (inv.total - inv.amountPaid), 0);
              return (
                <tr key={v.id}>
                  <td className="font-medium text-white">
                    <Link href={`/ap/vendors/${v.id}`} className="hover:text-accent-400">
                      {v.name}
                    </Link>
                  </td>
                  <td className="text-white/50">{v.email ?? v.phone ?? '—'}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(outstanding)}</td>
                  <td>
                    <span className={clsx('badge border', v.isActive ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-white/40')}>
                      {v.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <EditVendorButton vendor={v} />
                      <DeleteVendorButton id={v.id} />
                    </div>
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
