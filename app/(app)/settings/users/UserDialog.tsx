'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { createUser, deleteUser } from './actions';

export function NewUserButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add User
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add User">
        <form
          action={async (fd) => {
            try {
              setError(null);
              await createUser(fd);
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Name</label>
            <input name="name" className="glass-input" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
            <input name="email" type="email" required autoFocus className="glass-input" placeholder="tester@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Password</label>
            <input name="password" type="password" required minLength={8} className="glass-input" placeholder="At least 8 characters" />
          </div>
          <p className="text-xs text-white/40">Share this email and password with the person directly — they'll use it to sign in at /login.</p>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create User</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeleteUserButton({ id }: { id: string }) {
  return (
    <button
      className="icon-btn hover:!bg-red-500/15 hover:!text-red-300"
      onClick={async () => {
        if (!confirm('Delete this user? They will no longer be able to sign in.')) return;
        try {
          await deleteUser(id);
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Could not delete user');
        }
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
