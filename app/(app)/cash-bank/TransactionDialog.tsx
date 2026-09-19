'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createCashTransaction } from './actions';
import { formatDateInput } from '@/lib/format';

type Account = { id: string; name: string };
const TYPES = [
  { value: 'DEPOSIT', label: 'Deposit (money in)' },
  { value: 'WITHDRAWAL', label: 'Withdrawal (money out)' },
];

export function NewTransactionButton({ accounts }: { accounts: Account[] }) {
  const [open, setOpen] = useState(false);
  const [bankAccountId, setBankAccountId] = useState('');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [type, setType] = useState('DEPOSIT');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createCashTransaction({ bankAccountId, date, type: type as any, amount, description, category });
      setOpen(false);
      setAmount(0);
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)} disabled={accounts.length === 0}>
        <Plus className="h-4 w-4" /> New Transaction
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Cash Transaction">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Account</label>
            <select value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)} required className="glass-select">
              <option value="" className="bg-base-800">Select account…</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id} className="bg-base-800">{a.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="glass-select">
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-base-800">{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Amount</label>
              <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="glass-input" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input" placeholder="Rent, Utilities…" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="glass-input" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">Save Transaction</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
