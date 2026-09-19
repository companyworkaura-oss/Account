'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createDeliveryNote } from '../../actions';
import { formatDateInput } from '@/lib/format';

export function CreateDeliveryNoteButton({ salesOrderId }: { salesOrderId: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-secondary" onClick={() => setOpen(true)}>
        <Truck className="h-4 w-4" /> Create Delivery Note
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Delivery Note">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setError(null);
              await createDeliveryNote(salesOrderId, { date, notes });
              setOpen(false);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Delivery Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input" rows={2} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Delivery Note</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
