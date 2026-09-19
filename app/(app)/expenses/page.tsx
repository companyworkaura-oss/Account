import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { NewExpenseButton } from './ExpenseDialog';
import { ApproveRejectButtons, ReimburseButton, DeleteExpenseButton } from './ExpenseRowActions';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
  APPROVED: 'border-sky-400/20 bg-sky-500/10 text-sky-300',
  REJECTED: 'border-red-400/20 bg-red-500/10 text-red-300',
  REIMBURSED: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
};

export default async function ExpensesPage() {
  const [expenses, accounts] = await Promise.all([
    prisma.expenseClaim.findMany({ orderBy: { date: 'desc' } }),
    prisma.bankAccount.findMany({ where: { isActive: true }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Expense Management"
        breadcrumb={['Financial Management']}
        description="Employee expense claims — submit, approve, and reimburse."
        actions={<NewExpenseButton />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Claim #</th>
              <th>Employee</th>
              <th>Date</th>
              <th>Category</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-white/40">No expense claims yet.</td></tr>
            )}
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="font-medium text-white">{e.expenseNumber}</td>
                <td className="text-white/70">{e.employeeName}</td>
                <td className="text-white/50">{formatDate(e.date)}</td>
                <td className="text-white/50">{e.category ?? '—'}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(e.amount)}</td>
                <td><span className={clsx('badge border', STATUS_STYLE[e.status])}>{e.status}</span></td>
                <td>
                  <div className="flex justify-end gap-2">
                    {e.status === 'PENDING' && <ApproveRejectButtons id={e.id} />}
                    {e.status === 'APPROVED' && <ReimburseButton id={e.id} accounts={accounts} />}
                    <DeleteExpenseButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
