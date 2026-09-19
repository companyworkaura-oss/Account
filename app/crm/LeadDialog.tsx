'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowRightCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';
import { createLead, setLeadStage, convertLeadToCustomer, deleteLead } from './actions';

const STAGES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

export function NewLeadButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Lead
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Lead">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createLead(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Contact Name</label>
            <input name="name" required className="glass-input" placeholder="John Smith" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Company</label>
            <input name="company" className="glass-input" placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
              <input name="email" type="email" className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Phone</label>
              <input name="phone" className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Estimated Deal Value</label>
            <input name="value" type="number" min={0} step="0.01" defaultValue={0} className="glass-input" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Notes</label>
            <textarea name="notes" className="glass-input" rows={2} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Lead</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function StageSelect({ id, stage }: { id: string; stage: string }) {
  return (
    <select defaultValue={stage} onChange={(e) => setLeadStage(id, e.target.value)} className="glass-select !py-1.5 text-xs">
      {STAGES.map((s) => (
        <option key={s} value={s} className="bg-base-800">{s}</option>
      ))}
    </select>
  );
}

export function ConvertLeadButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      className="icon-btn hover:!bg-accent-500/15 hover:!text-accent-300"
      title="Convert to Customer"
      onClick={async () => {
        const customerId = await convertLeadToCustomer(id);
        router.push(`/ar/customers/${customerId}`);
      }}
    >
      <ArrowRightCircle className="h-3.5 w-3.5" />
    </button>
  );
}

export function DeleteLeadButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      onClick={async () => {
        if (!confirm('Delete this lead?')) return;
        await deleteLead(id);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
