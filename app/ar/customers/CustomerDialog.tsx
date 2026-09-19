'use client';

import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createCustomer, updateCustomer } from './actions';

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  isActive: boolean;
};

function CustomerFields({ customer }: { customer?: Customer }) {
  return (
    <>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Customer Name</label>
        <input name="name" defaultValue={customer?.name} required className="glass-input" placeholder="Blue Horizon LLC" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
          <input name="email" type="email" defaultValue={customer?.email ?? ''} className="glass-input" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Phone</label>
          <input name="phone" defaultValue={customer?.phone ?? ''} className="glass-input" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Address</label>
        <input name="address" defaultValue={customer?.address ?? ''} className="glass-input" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Tax ID</label>
        <input name="taxId" defaultValue={customer?.taxId ?? ''} className="glass-input" />
      </div>
    </>
  );
}

export function NewCustomerButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Customer
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Customer">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createCustomer(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <CustomerFields />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Customer</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function EditCustomerButton({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Edit customer">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Customer">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await updateCustomer(customer.id, fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <CustomerFields customer={customer} />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="isActive" defaultChecked={customer.isActive} className="h-4 w-4 rounded border-white/20 bg-white/5" />
            Active
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
