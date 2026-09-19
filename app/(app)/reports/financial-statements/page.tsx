import { getBalanceSheet, getCashFlowStatement, getIncomeStatement } from '@/lib/reports';
import { PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { Tabs } from './Tabs';
import { CashFlowChart } from '@/components/charts/CashFlowChart';

export const dynamic = 'force-dynamic';

export default async function FinancialStatementsPage() {
  const [income, balanceSheet, cashFlow] = await Promise.all([
    getIncomeStatement(),
    getBalanceSheet(),
    getCashFlowStatement(),
  ]);

  return (
    <div>
      <PageHeader
        title="Financial Statements"
        breadcrumb={['Reporting & Compliance']}
        description="Profit & Loss, Balance Sheet, and Cash Flow — generated live from your ledger."
      />

      <Tabs
        tabs={[
          {
            label: 'Profit & Loss',
            content: (
              <div className="glass-panel overflow-hidden">
                <table className="table-shell">
                  <tbody>
                    <tr className="bg-white/[0.02]">
                      <td colSpan={2} className="text-xs font-semibold uppercase tracking-wide text-accent-400">
                        Revenue
                      </td>
                    </tr>
                    {income.revenue.map((a) => (
                      <tr key={a.id}>
                        <td className="text-white/70">{a.name}</td>
                        <td className="text-right font-mono text-white/80">{formatCurrency(a.balance)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="font-semibold text-white">Total Revenue</td>
                      <td className="text-right font-mono font-semibold text-white">{formatCurrency(income.totalRevenue)}</td>
                    </tr>
                    <tr className="bg-white/[0.02]">
                      <td colSpan={2} className="text-xs font-semibold uppercase tracking-wide text-accent-400">
                        Expenses
                      </td>
                    </tr>
                    {income.expense.map((a) => (
                      <tr key={a.id}>
                        <td className="text-white/70">{a.name}</td>
                        <td className="text-right font-mono text-white/80">{formatCurrency(a.balance)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="font-semibold text-white">Total Expenses</td>
                      <td className="text-right font-mono font-semibold text-white">{formatCurrency(income.totalExpense)}</td>
                    </tr>
                    <tr className="bg-white/[0.04]">
                      <td className="font-semibold text-white">Net Income</td>
                      <td
                        className={`text-right font-mono font-semibold ${income.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                      >
                        {formatCurrency(income.netIncome)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            label: 'Balance Sheet',
            content: (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="glass-panel overflow-hidden">
                  <table className="table-shell">
                    <tbody>
                      <tr className="bg-white/[0.02]">
                        <td colSpan={2} className="text-xs font-semibold uppercase tracking-wide text-accent-400">
                          Assets
                        </td>
                      </tr>
                      {balanceSheet.assets.map((a) => (
                        <tr key={a.id}>
                          <td className="text-white/70">{a.name}</td>
                          <td className="text-right font-mono text-white/80">{formatCurrency(a.balance)}</td>
                        </tr>
                      ))}
                      <tr className="bg-white/[0.04]">
                        <td className="font-semibold text-white">Total Assets</td>
                        <td className="text-right font-mono font-semibold text-white">{formatCurrency(balanceSheet.totalAssets)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="glass-panel overflow-hidden">
                  <table className="table-shell">
                    <tbody>
                      <tr className="bg-white/[0.02]">
                        <td colSpan={2} className="text-xs font-semibold uppercase tracking-wide text-accent-400">
                          Liabilities
                        </td>
                      </tr>
                      {balanceSheet.liabilities.map((a) => (
                        <tr key={a.id}>
                          <td className="text-white/70">{a.name}</td>
                          <td className="text-right font-mono text-white/80">{formatCurrency(a.balance)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="font-semibold text-white">Total Liabilities</td>
                        <td className="text-right font-mono font-semibold text-white">{formatCurrency(balanceSheet.totalLiabilities)}</td>
                      </tr>
                      <tr className="bg-white/[0.02]">
                        <td colSpan={2} className="text-xs font-semibold uppercase tracking-wide text-accent-400">
                          Equity
                        </td>
                      </tr>
                      {balanceSheet.equity.map((a) => (
                        <tr key={a.id}>
                          <td className="text-white/70">{a.name}</td>
                          <td className="text-right font-mono text-white/80">{formatCurrency(a.balance)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="text-white/70">Net Income (current)</td>
                        <td className="text-right font-mono text-white/80">{formatCurrency(balanceSheet.netIncome)}</td>
                      </tr>
                      <tr className="bg-white/[0.04]">
                        <td className="font-semibold text-white">Total Liabilities & Equity</td>
                        <td className="text-right font-mono font-semibold text-white">
                          {formatCurrency(balanceSheet.totalLiabilities + balanceSheet.totalEquity)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className={`lg:col-span-2 text-sm ${balanceSheet.balanced ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {balanceSheet.balanced ? 'Balance sheet is balanced.' : 'Assets do not yet equal Liabilities + Equity — check open journal entries.'}
                </p>
              </div>
            ),
          },
          {
            label: 'Cash Flow',
            content: (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="glass-card">
                    <p className="text-xs text-white/40">Total Inflow</p>
                    <p className="mt-1 text-xl font-semibold text-emerald-400">{formatCurrency(cashFlow.inflow)}</p>
                  </div>
                  <div className="glass-card">
                    <p className="text-xs text-white/40">Total Outflow</p>
                    <p className="mt-1 text-xl font-semibold text-red-400">{formatCurrency(cashFlow.outflow)}</p>
                  </div>
                  <div className="glass-card">
                    <p className="text-xs text-white/40">Net Cash Flow</p>
                    <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(cashFlow.net)}</p>
                  </div>
                </div>
                <div className="glass-card">
                  <CashFlowChart data={cashFlow.monthly} />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
