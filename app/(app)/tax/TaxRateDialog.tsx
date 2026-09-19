'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createTaxRate, toggleTaxRateActive, deleteTaxRate } from './actions';

const TYPES = ['VAT', 'GST', 'WITHHOLDING', 'OTHER'];

export function NewTaxRateButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Tax Rate
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Tax Rate">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createTaxRate(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Name</label>
            <input name="name" required className="glass-input" placeholder="Standard VAT" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Rate (%)</label>
              <input name="rate" type="number" min={0} step="0.01" required className="glass-input" placeholder="15" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Type</label>
              <select name="type" defaultValue="VAT" className="glass-select">
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-base-800">{t}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Tax Rate</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function TaxRateActiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <input
      type="checkbox"
      defaultChecked={isActive}
      onChange={(e) => toggleTaxRateActive(id, e.target.checked)}
      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-accent-500"
    />
  );
}

export function DeleteTaxRateButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      onClick={async () => {
        if (!confirm('Delete this tax rate?')) return;
        await deleteTaxRate(id);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
