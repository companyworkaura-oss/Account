'use client';

import { useState } from 'react';
import { Check, X, Banknote, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { setExpenseStatus, reimburseExpense, deleteExpense } from './actions';

type Account = { id: string; name: string };

export function ApproveRejectButtons({ id }: { id: string }) {
  return (
    <div className="flex justify-end gap-2">
      <button className="icon-btn hover:!bg-emerald-500/15 hover:!text-emerald-300" title="Approve" onClick={() => setExpenseStatus(id, 'APPROVED')}>
        <Check className="h-3.5 w-3.5" />
      </button>
      <button className="icon-btn hover:!bg-red-500/15 hover:!text-red-300" title="Reject" onClick={() => setExpenseStatus(id, 'REJECTED')}>
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ReimburseButton({ id, accounts }: { id: string; accounts: Account[] }) {
  const [open, setOpen] = useState(false);
  const [bankAccountId, setBankAccountId] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="icon-btn hover:!bg-accent-500/15 hover:!text-accent-300" title="Mark as reimbursed" onClick={() => setOpen(true)}>
        <Banknote className="h-3.5 w-3.5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Reimburse Expense">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setError(null);
              await reimburseExpense(id, bankAccountId);
              setOpen(false);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Pay from Account</label>
            <select value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)} required className="glass-select">
              <option value="" className="bg-base-800">Select account…</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id} className="bg-base-800">{a.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Confirm Reimbursement</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeleteExpenseButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      onClick={async () => {
        if (!confirm('Delete this expense claim?')) return;
        await deleteExpense(id);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
