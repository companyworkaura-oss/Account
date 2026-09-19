import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { Tabs } from '@/components/Tabs';
import { NewTaxRateButton, TaxRateActiveToggle, DeleteTaxRateButton } from './TaxRateDialog';

export const dynamic = 'force-dynamic';

export default async function TaxPage() {
  const [taxRates, salesInvoices, purchaseInvoices] = await Promise.all([
    prisma.taxRate.findMany({ orderBy: { name: 'asc' } }),
    prisma.salesInvoice.findMany({ select: { tax: true, date: true } }),
    prisma.purchaseInvoice.findMany({ select: { tax: true, date: true } }),
  ]);

  const taxCollected = salesInvoices.reduce((s, i) => s + i.tax, 0);
  const taxPaid = purchaseInvoices.reduce((s, i) => s + i.tax, 0);
  const netPayable = taxCollected - taxPaid;

  return (
    <div>
      <PageHeader
        title="Tax Management"
        breadcrumb={['Financial Management']}
        description="Configure tax rates and see what you owe or can reclaim."
      />

      <Tabs
        tabs={[
          {
            label: 'Tax Report',
            content: (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="glass-card">
                    <p className="text-xs text-white/40">Sales Tax Collected</p>
                    <p className="mt-1 text-xl font-semibold text-emerald-400">{formatCurrency(taxCollected)}</p>
                  </div>
                  <div className="glass-card">
                    <p className="text-xs text-white/40">Purchase Tax Paid</p>
                    <p className="mt-1 text-xl font-semibold text-red-400">{formatCurrency(taxPaid)}</p>
                  </div>
                  <div className="glass-card">
                    <p className="text-xs text-white/40">Net Tax Payable</p>
                    <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(netPayable)}</p>
                  </div>
                </div>
                <p className="text-xs text-white/40">
                  Based on the tax amounts recorded on all Sales and Purchase Invoices to date. Positive net payable means
                  you owe the tax authority; negative means you can reclaim.
                </p>
              </div>
            ),
          },
          {
            label: 'Tax Rates',
            content: (
              <div>
                <div className="mb-4 flex justify-end"><NewTaxRateButton /></div>
                <div className="glass-panel overflow-hidden">
                  <table className="table-shell">
                    <thead>
                      <tr><th>Name</th><th>Type</th><th className="text-right">Rate</th><th>Active</th><th className="text-right">Actions</th></tr>
                    </thead>
                    <tbody>
                      {taxRates.length === 0 && (
                        <tr><td colSpan={5} className="py-10 text-center text-white/40">No tax rates configured yet.</td></tr>
                      )}
                      {taxRates.map((t) => (
                        <tr key={t.id}>
                          <td className="font-medium text-white">{t.name}</td>
                          <td className="text-white/50">{t.type}</td>
                          <td className="text-right font-mono text-white/80">{t.rate}%</td>
                          <td><TaxRateActiveToggle id={t.id} isActive={t.isActive} /></td>
                          <td><div className="flex justify-end"><DeleteTaxRateButton id={t.id} /></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
