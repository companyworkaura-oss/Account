'use client';

import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createVendor, updateVendor } from './actions';

type Vendor = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  isActive: boolean;
};

function VendorFields({ vendor }: { vendor?: Vendor }) {
  return (
    <>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Vendor Name</label>
        <input name="name" defaultValue={vendor?.name} required className="glass-input" placeholder="Acme Supplies" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
          <input name="email" type="email" defaultValue={vendor?.email ?? ''} className="glass-input" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Phone</label>
          <input name="phone" defaultValue={vendor?.phone ?? ''} className="glass-input" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Address</label>
        <input name="address" defaultValue={vendor?.address ?? ''} className="glass-input" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Tax ID</label>
        <input name="taxId" defaultValue={vendor?.taxId ?? ''} className="glass-input" />
      </div>
    </>
  );
}

export function NewVendorButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Vendor
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Vendor">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createVendor(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <VendorFields />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Vendor
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function EditVendorButton({ vendor }: { vendor: Vendor }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Edit vendor">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Vendor">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await updateVendor(vendor.id, fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <VendorFields vendor={vendor} />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="isActive" defaultChecked={vendor.isActive} className="h-4 w-4 rounded border-white/20 bg-white/5" />
            Active
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
