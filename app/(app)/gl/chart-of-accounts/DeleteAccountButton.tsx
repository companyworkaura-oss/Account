'use client';

import { Trash2 } from 'lucide-react';
import { deleteAccount } from './actions';

export function DeleteAccountButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      aria-label="Delete account"
      onClick={async () => {
        if (!confirm('Delete this account? This cannot be undone.')) return;
        try {
          await deleteAccount(id);
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Could not delete account');
        }
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
