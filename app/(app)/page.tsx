import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAPOutstanding, getAROutstanding, getCashFlowStatement, getCashPosition, getIncomeStatement } from '@/lib/reports';
import { formatCurrency, formatDate } from '@/lib/format';
import { PageHeader, StatCard, StatusPill } from '@/components/ui';
import { CashFlowChart } from '@/components/charts/CashFlowChart';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [cash, ar, ap, income, cashFlow, recentSales, recentPurchases, recentJournal] = await Promise.all([
    getCashPosition(),
    getAROutstanding(),
    getAPOutstanding(),
    getIncomeStatement(),
    getCashFlowStatement(),
    prisma.salesInvoice.findMany({ include: { customer: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.purchaseInvoice.findMany({ include: { vendor: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.journalEntry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live snapshot of your books, stored locally on this PC."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cash & Bank" value={formatCurrency(cash.total)} icon={Wallet} tone="default" trend={`${cash.accounts.length} account(s)`} />
        <StatCard label="Accounts Receivable" value={formatCurrency(ar)} icon={ArrowDownToLine} tone={ar > 0 ? 'positive' : 'default'} trend="Outstanding from customers" />
        <StatCard label="Accounts Payable" value={formatCurrency(ap)} icon={ArrowUpFromLine} tone={ap > 0 ? 'negative' : 'default'} trend="Owed to vendors" />
        <StatCard
          label="Net Income"
          value={formatCurrency(income.netIncome)}
          icon={TrendingUp}
          tone={income.netIncome >= 0 ? 'positive' : 'negative'}
          trend="Revenue less expenses"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="glass-card xl:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Cash Flow Trend</h2>
            <Link href="/reports/financial-statements" className="text-xs font-medium text-accent-400 hover:text-accent-300">
              View reports
            </Link>
          </div>
          <CashFlowChart data={cashFlow.monthly} />
        </div>

        <div className="glass-card">
          <h2 className="mb-3 text-sm font-semibold text-white">Recent Journal Entries</h2>
          <div className="flex flex-col gap-2">
            {recentJournal.length === 0 && <p className="text-sm text-white/35">No journal entries yet.</p>}
            {recentJournal.map((je) => (
              <div key={je.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-white/85">{je.entryNumber}</p>
                  <p className="text-xs text-white/40">{je.memo ?? 'No memo'}</p>
                </div>
                <div className="text-right">
                  <StatusPill status={je.status} />
                  <p className="mt-1 text-xs text-white/40">{formatDate(je.date)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/gl/journal-entries" className="mt-3 block text-center text-xs font-medium text-accent-400 hover:text-accent-300">
            View all entries →
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Sales Invoices</h2>
            <Link href="/ar/sales-invoices" className="text-xs font-medium text-accent-400 hover:text-accent-300">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentSales.length === 0 && <p className="text-sm text-white/35">No sales invoices yet.</p>}
            {recentSales.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-white/85">{inv.invoiceNumber}</p>
                  <p className="text-xs text-white/40">{inv.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/85">{formatCurrency(inv.total)}</p>
                  <StatusPill status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Purchase Invoices</h2>
            <Link href="/ap/purchase-invoices" className="text-xs font-medium text-accent-400 hover:text-accent-300">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentPurchases.length === 0 && <p className="text-sm text-white/35">No purchase invoices yet.</p>}
            {recentPurchases.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-white/85">{inv.invoiceNumber}</p>
                  <p className="text-xs text-white/40">{inv.vendor.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/85">{formatCurrency(inv.total)}</p>
                  <StatusPill status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
