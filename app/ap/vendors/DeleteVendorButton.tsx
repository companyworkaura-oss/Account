'use client';

import { Trash2 } from 'lucide-react';
import { deleteVendor } from './actions';

export function DeleteVendorButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      aria-label="Delete vendor"
      onClick={async () => {
        if (!confirm('Delete this vendor?')) return;
        try {
          await deleteVendor(id);
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Could not delete vendor');
        }
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
