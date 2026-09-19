'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createItem } from './actions';

export function NewItemButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Item
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Inventory Item">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createItem(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">SKU</label>
              <input name="sku" required className="glass-input" placeholder="ITM-001" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Unit</label>
              <input name="unit" defaultValue="pcs" className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Item Name</label>
            <input name="name" required className="glass-input" placeholder="Wireless Mouse" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Cost Price</label>
              <input name="costPrice" type="number" min={0} step="0.01" defaultValue={0} className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Selling Price</label>
              <input name="unitPrice" type="number" min={0} step="0.01" defaultValue={0} className="glass-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Opening Quantity</label>
              <input name="quantityOnHand" type="number" min={0} step="1" defaultValue={0} className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Reorder Level</label>
              <input name="reorderLevel" type="number" min={0} step="1" defaultValue={0} className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Description</label>
            <textarea name="description" className="glass-input" rows={2} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Item</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
