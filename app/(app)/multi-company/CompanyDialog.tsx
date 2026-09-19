'use client';

import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createCompany, setActiveCompany, deleteCompany } from './actions';

export function NewCompanyButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Company
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Company">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createCompany(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Company Name</label>
            <input name="name" required className="glass-input" placeholder="My Second Company Ltd" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Currency</label>
              <input name="currency" defaultValue="USD" className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Tax ID</label>
              <input name="taxId" className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Address</label>
            <textarea name="address" className="glass-input" rows={2} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Company</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function SetActiveButton({ id }: { id: string }) {
  return (
    <button className="btn-secondary" onClick={() => setActiveCompany(id)}>
      <Check className="h-4 w-4" /> Set Active
    </button>
  );
}

export function DeleteCompanyButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      onClick={async () => {
        if (!confirm('Delete this company profile?')) return;
        await deleteCompany(id);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
