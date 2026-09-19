'use client';

import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createAccount, updateAccount } from './actions';

const ACCOUNT_TYPES = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];

type Account = {
  id: string;
  code: string;
  name: string;
  type: string;
  subType: string | null;
  description: string | null;
  isActive: boolean;
};

export function NewAccountButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Account
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Account">
        <form
          action={async (formData) => {
            try {
              setError(null);
              await createAccount(formData);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <AccountFields />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Account
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function EditAccountButton({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Edit account">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Account">
        <form
          action={async (formData) => {
            try {
              setError(null);
              await updateAccount(account.id, formData);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <AccountFields account={account} />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="isActive" defaultChecked={account.isActive} className="h-4 w-4 rounded border-white/20 bg-white/5" />
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

function AccountFields({ account }: { account?: Account }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Code</label>
          <input name="code" defaultValue={account?.code} required className="glass-input" placeholder="1000" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Type</label>
          <select name="type" defaultValue={account?.type ?? 'ASSET'} className="glass-select">
            {ACCOUNT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-base-800">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Account Name</label>
        <input name="name" defaultValue={account?.name} required className="glass-input" placeholder="Cash on Hand" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Sub-type (optional)</label>
        <input name="subType" defaultValue={account?.subType ?? ''} className="glass-input" placeholder="Current Asset" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Description (optional)</label>
        <textarea name="description" defaultValue={account?.description ?? ''} className="glass-input" rows={2} />
      </div>
    </>
  );
}
