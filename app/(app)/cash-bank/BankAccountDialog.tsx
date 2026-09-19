'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createBankAccount } from './actions';

export function NewBankAccountButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button className="btn-secondary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Account
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Bank / Cash Account">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createBankAccount(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Account Name</label>
            <input name="name" required className="glass-input" placeholder="Main Operating Account" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Bank Name</label>
              <input name="bankName" className="glass-input" placeholder="First National Bank" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Account Number</label>
              <input name="accountNumber" className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Opening Balance</label>
            <input name="openingBalance" type="number" step="0.01" defaultValue={0} className="glass-input" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Account</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
