'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createAsset } from './actions';
import { formatDateInput } from '@/lib/format';

export function NewAssetButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Asset
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Fixed Asset">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createAsset(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Asset Name</label>
            <input name="name" required className="glass-input" placeholder="Delivery Van" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Category</label>
              <input name="category" className="glass-input" placeholder="Vehicle, Equipment…" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Purchase Date</label>
              <input name="purchaseDate" type="date" defaultValue={formatDateInput(new Date())} required className="glass-input" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Purchase Cost</label>
              <input name="purchaseCost" type="number" min={0} step="0.01" required className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Salvage Value</label>
              <input name="salvageValue" type="number" min={0} step="0.01" defaultValue={0} className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Useful Life (yrs)</label>
              <input name="usefulLifeYears" type="number" min={1} step="1" defaultValue={5} required className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Notes</label>
            <textarea name="notes" className="glass-input" rows={2} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Asset</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
