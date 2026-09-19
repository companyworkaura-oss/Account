'use client';

import { useState } from 'react';
import { TrendingDown, PackageMinus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { recordDepreciation, disposeAsset, deleteAsset } from './actions';
import { formatDateInput } from '@/lib/format';

export function RecordDepreciationButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn"
      title="Record one month of depreciation"
      onClick={async () => {
        try {
          await recordDepreciation(id);
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Could not record depreciation');
        }
      }}
    >
      <TrendingDown className="h-3.5 w-3.5" />
    </button>
  );
}

export function DisposeAssetButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="icon-btn" title="Dispose asset" onClick={() => setOpen(true)}>
        <PackageMinus className="h-3.5 w-3.5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Dispose Asset">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setError(null);
              await disposeAsset(id, { date, amount });
              setOpen(false);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Disposal Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Disposal Amount (sale proceeds)</label>
            <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="glass-input" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-danger">Confirm Disposal</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeleteAssetButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      onClick={async () => {
        if (!confirm('Delete this asset?')) return;
        await deleteAsset(id);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
