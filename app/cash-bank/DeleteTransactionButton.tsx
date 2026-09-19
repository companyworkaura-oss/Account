'use client';

import { Trash2 } from 'lucide-react';
import { deleteCashTransaction } from './actions';

export function DeleteTransactionButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      aria-label="Delete transaction"
      onClick={async () => {
        if (!confirm('Delete this transaction?')) return;
        await deleteCashTransaction(id);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
