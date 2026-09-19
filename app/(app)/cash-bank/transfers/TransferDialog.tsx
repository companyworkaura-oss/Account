'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createBankTransfer } from '../actions';
import { formatDateInput } from '@/lib/format';

type Account = { id: string; name: string };

export function NewTransferButton({ accounts }: { accounts: Account[] }) {
  const [open, setOpen] = useState(false);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createBankTransfer({ fromAccountId, toAccountId, date, amount, notes });
      setOpen(false);
      setAmount(0);
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)} disabled={accounts.length < 2}>
        <Plus className="h-4 w-4" /> New Transfer
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Bank Transfer">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">From Account</label>
              <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required className="glass-select">
                <option value="" className="bg-base-800">Select…</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-base-800">{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">To Account</label>
              <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required className="glass-select">
                <option value="" className="bg-base-800">Select…</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-base-800">{a.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Amount</label>
              <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="glass-input" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">Save Transfer</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
