import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { BudgetInput } from './BudgetInput';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function BudgetingPage({ searchParams }: { searchParams: { year?: string } }) {
  const currentYear = new Date().getFullYear();
  const year = Number(searchParams.year) || currentYear;
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const accounts = await prisma.account.findMany({
    where: { type: { in: ['REVENUE', 'EXPENSE'] }, isActive: true },
    orderBy: { code: 'asc' },
    include: {
      budgets: { where: { year } },
      lines: {
        where: { journalEntry: { date: { gte: new Date(`${year}-01-01`), lt: new Date(`${year + 1}-01-01`) } } },
      },
    },
  });

  const rows = accounts.map((acc) => {
    const budget = acc.budgets[0]?.amount ?? 0;
    const debit = acc.lines.reduce((s, l) => s + l.debit, 0);
    const credit = acc.lines.reduce((s, l) => s + l.credit, 0);
    const actual = acc.type === 'EXPENSE' ? debit - credit : credit - debit;
    const variance = actual - budget;
    return { id: acc.id, code: acc.code, name: acc.name, type: acc.type, budget, actual, variance };
  });

  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);

  return (
    <div>
      <PageHeader
        title="Budgeting & Forecasting"
        breadcrumb={['Financial Management']}
        description="Set an annual budget per account and track variance against actuals."
        actions={
          <div className="flex gap-1.5">
            {years.map((y) => (
              <Link
                key={y}
                href={`/budgeting?year=${y}`}
                className={clsx(
                  'rounded-xl border px-3.5 py-2 text-sm font-medium transition',
                  y === year ? 'border-accent-500/40 bg-accent-500/10 text-accent-300' : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                )}
              >
                {y}
              </Link>
            ))}
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card"><p className="text-xs text-white/40">Total Budgeted ({year})</p><p className="mt-1 text-xl font-semibold text-white">{formatCurrency(totalBudget)}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Total Actual ({year})</p><p className="mt-1 text-xl font-semibold text-white">{formatCurrency(totalActual)}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Net Variance</p><p className={clsx('mt-1 text-xl font-semibold', totalActual - totalBudget <= 0 ? 'text-emerald-400' : 'text-amber-400')}>{formatCurrency(totalActual - totalBudget)}</p></div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th className="w-40 text-right">Budget ({year})</th>
              <th className="text-right">Actual</th>
              <th className="text-right">Variance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="py-10 text-center text-white/40">No revenue/expense accounts found. Add accounts in Chart of Accounts first.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-medium text-white">{r.code} · {r.name}</td>
                <td className="text-white/40">{r.type}</td>
                <td><BudgetInput accountId={r.id} year={year} initial={r.budget} /></td>
                <td className="text-right font-mono text-white/80">{formatCurrency(r.actual)}</td>
                <td className={clsx('text-right font-mono', r.variance <= 0 ? 'text-emerald-400' : 'text-amber-400')}>{formatCurrency(r.variance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
