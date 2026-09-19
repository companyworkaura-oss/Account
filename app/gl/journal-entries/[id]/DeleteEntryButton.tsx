'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteJournalEntry } from '../actions';

export function DeleteEntryButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      className="btn-danger"
      onClick={async () => {
        if (!confirm('Delete this journal entry? This cannot be undone.')) return;
        await deleteJournalEntry(id);
        router.push('/gl/journal-entries');
      }}
    >
      <Trash2 className="h-4 w-4" /> Delete
    </button>
  );
}
