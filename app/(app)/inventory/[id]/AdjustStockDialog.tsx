'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { adjustStock } from '../actions';
import { formatDateInput } from '@/lib/format';

const TYPES = [
  { value: 'IN', label: 'Stock In (received)' },
  { value: 'OUT', label: 'Stock Out (sold/used)' },
  { value: 'ADJUSTMENT', label: 'Adjustment (correction)' },
];

export function AdjustStockButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [type, setType] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>('IN');
  const [quantity, setQuantity] = useState(0);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adjustStock(itemId, { date, type, quantity, reference, notes });
      setOpen(false);
      setQuantity(0);
      setReference('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Adjust Stock
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Adjust Stock">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Movement Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="glass-select">
              {TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-base-800">{t.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Quantity</label>
              <input type="number" min={0} step="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 0)} className="glass-input" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Reference</label>
            <input value={reference} onChange={(e) => setReference(e.target.value)} className="glass-input" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">Save Movement</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
