import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { NewCustomerButton, EditCustomerButton } from './CustomerDialog';
import { DeleteCustomerButton } from './DeleteCustomerButton';
import { formatCurrency } from '@/lib/format';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { salesInvoices: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <PageHeader
        title="Customer Management"
        breadcrumb={['Accounts Receivable']}
        description="Manage the customers you invoice for goods and services."
        actions={<NewCustomerButton />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th className="text-right">Outstanding</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-white/40">No customers yet. Add your first customer to get started.</td>
              </tr>
            )}
            {customers.map((c) => {
              const outstanding = c.salesInvoices.reduce((s, inv) => s + (inv.total - inv.amountPaid), 0);
              return (
                <tr key={c.id}>
                  <td className="font-medium text-white">
                    <Link href={`/ar/customers/${c.id}`} className="hover:text-accent-400">{c.name}</Link>
                  </td>
                  <td className="text-white/50">{c.email ?? c.phone ?? '—'}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(outstanding)}</td>
                  <td>
                    <span className={clsx('badge border', c.isActive ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-white/40')}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <EditCustomerButton customer={c} />
                      <DeleteCustomerButton id={c.id} />
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
