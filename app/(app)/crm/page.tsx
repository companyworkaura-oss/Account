import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { NewLeadButton, StageSelect, ConvertLeadButton, DeleteLeadButton } from './LeadDialog';

export const dynamic = 'force-dynamic';

export default async function CRMPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  const pipelineValue = leads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST').reduce((s, l) => s + l.value, 0);
  const wonValue = leads.filter((l) => l.stage === 'WON').reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <PageHeader
        title="CRM Integration"
        breadcrumb={['Advanced / Optional']}
        description="Track leads and deals, and convert won leads straight into customers."
        actions={<NewLeadButton />}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card"><p className="text-xs text-white/40">Open Leads</p><p className="mt-1 text-xl font-semibold text-white">{leads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST').length}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Pipeline Value</p><p className="mt-1 text-xl font-semibold text-white">{formatCurrency(pipelineValue)}</p></div>
        <div className="glass-card"><p className="text-xs text-white/40">Won Value</p><p className="mt-1 text-xl font-semibold text-emerald-400">{formatCurrency(wonValue)}</p></div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr><th>Lead</th><th>Company</th><th className="text-right">Value</th><th>Stage</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={5} className="py-10 text-center text-white/40">No leads yet. Add your first lead to start tracking.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="font-medium text-white">{l.name}</td>
                <td className="text-white/50">{l.company ?? '—'}</td>
                <td className="text-right font-mono text-white/80">{formatCurrency(l.value)}</td>
                <td><StageSelect id={l.id} stage={l.stage} /></td>
                <td>
                  <div className="flex justify-end gap-2">
                    {l.stage === 'WON' && !l.customerId && <ConvertLeadButton id={l.id} />}
                    <DeleteLeadButton id={l.id} />
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
