'use client';

import { Trash2 } from 'lucide-react';
import { deleteCustomer } from './actions';

export function DeleteCustomerButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      aria-label="Delete customer"
      onClick={async () => {
        if (!confirm('Delete this customer?')) return;
        try {
          await deleteCustomer(id);
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Could not delete customer');
        }
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
