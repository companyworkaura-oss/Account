import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { NewAssetButton } from './AssetDialog';
import { RecordDepreciationButton, DisposeAssetButton, DeleteAssetButton } from './AssetRowActions';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function FixedAssetsPage() {
  const assets = await prisma.asset.findMany({ orderBy: { purchaseDate: 'desc' } });

  const totalCost = assets.reduce((s, a) => s + a.purchaseCost, 0);
  const totalDepreciation = assets.reduce((s, a) => s + a.accumulatedDepreciation, 0);
  const totalNetBook = assets.filter((a) => a.status === 'ACTIVE').reduce((s, a) => s + (a.purchaseCost - a.accumulatedDepreciation), 0);

  return (
    <div>
      <PageHeader
        title="Fixed Assets Management"
        breadcrumb={['Financial Management']}
        description="Asset register, straight-line depreciation, and disposal."
        actions={<NewAssetButton />}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card"><p className="text-xs text-white/40">Total Cost</p><p className="mt-1 text-xl font-semibold text-white">{formatCurrency(totalCost)}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Accumulated Depreciation</p><p className="mt-1 text-xl font-semibold text-amber-400">{formatCurrency(totalDepreciation)}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Net Book Value (active)</p><p className="mt-1 text-xl font-semibold text-emerald-400">{formatCurrency(totalNetBook)}</p></div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Category</th>
              <th>Purchase Date</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Acc. Depreciation</th>
              <th className="text-right">Net Book Value</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 && (
              <tr><td colSpan={8} className="py-10 text-center text-white/40">No assets yet. Add your first asset to get started.</td></tr>
            )}
            {assets.map((a) => {
              const netBook = a.purchaseCost - a.accumulatedDepreciation;
              return (
                <tr key={a.id}>
                  <td className="font-medium text-white">{a.name}</td>
                  <td className="text-white/50">{a.category ?? '—'}</td>
                  <td className="text-white/50">{formatDate(a.purchaseDate)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(a.purchaseCost)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(a.accumulatedDepreciation)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(netBook)}</td>
                  <td>
                    <span className={clsx('badge border', a.status === 'ACTIVE' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-white/40')}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {a.status === 'ACTIVE' && (
                        <>
                          <RecordDepreciationButton id={a.id} />
                          <DisposeAssetButton id={a.id} />
                        </>
                      )}
                      <DeleteAssetButton id={a.id} />
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
