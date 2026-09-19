import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { POSForm } from './POSForm';

export const dynamic = 'force-dynamic';

export default async function POSPage() {
  const [accounts, items, recentSales] = await Promise.all([
    prisma.bankAccount.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.item.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, sku: true, name: true, unitPrice: true } }),
    prisma.pOSSale.findMany({ include: { bankAccount: true }, orderBy: { date: 'desc' }, take: 10 }),
  ]);

  return (
    <div>
      <PageHeader
        title="Point of Sale (POS)"
        breadcrumb={['Advanced / Optional']}
        description="A quick checkout screen for in-person sales — posts straight to Cash & Bank."
      />

      {accounts.length === 0 ? (
        <div className="glass-card text-center text-white/40">Add a bank/cash account under Cash & Bank → Cash Transactions first.</div>
      ) : (
        <POSForm accounts={accounts} items={items} />
      )}

      <div className="mt-6 glass-panel overflow-hidden">
        <div className="px-4 pt-4 text-sm font-semibold text-white">Recent Sales</div>
        <table className="table-shell">
          <thead><tr><th>Sale #</th><th>Customer</th><th>Account</th><th>Date</th><th className="text-right">Total</th></tr></thead>
          <tbody>
            {recentSales.length === 0 && (<tr><td colSpan={5} className="py-8 text-center text-white/40">No sales yet.</td></tr>)}
            {recentSales.map((s) => (
              <tr key={s.id}>
                <td className="font-medium text-white">{s.saleNumber}</td>
                <td className="text-white/60">{s.customerName ?? 'Walk-in'}</td>
                <td className="text-white/50">{s.bankAccount.name}</td>
                <td className="text-white/50">{formatDate(s.date)}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(s.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
