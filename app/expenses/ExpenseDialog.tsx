'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createExpense } from './actions';
import { formatDateInput } from '@/lib/format';

export function NewExpenseButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> New Expense Claim
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Expense Claim">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createExpense(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Employee Name</label>
            <input name="employeeName" required className="glass-input" placeholder="Jane Doe" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Date</label>
              <input name="date" type="date" defaultValue={formatDateInput(new Date())} required className="glass-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Amount</label>
              <input name="amount" type="number" min={0} step="0.01" required className="glass-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Category</label>
            <input name="category" className="glass-input" placeholder="Travel, Meals, Supplies…" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Description</label>
            <textarea name="description" className="glass-input" rows={2} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Submit Claim</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
