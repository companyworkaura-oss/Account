'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createJournalEntry, type JournalLineInput } from '../actions';
import { formatCurrency, formatDateInput } from '@/lib/format';

type Account = { id: string; code: string; name: string };

type Row = JournalLineInput & { key: string };

function emptyRow(): Row {
  return { key: crypto.randomUUID(), accountId: '', debit: 0, credit: 0, description: '' };
}

export function JournalEntryForm({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [memo, setMemo] = useState('');
  const [reference, setReference] = useState('');
  const [rows, setRows] = useState<Row[]>([emptyRow(), emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalDebit = rows.reduce((s, r) => s + (Number(r.debit) || 0), 0);
  const totalCredit = rows.reduce((s, r) => s + (Number(r.credit) || 0), 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: string) {
    setRows((rs) => (rs.length > 2 ? rs.filter((r) => r.key !== key) : rs));
  }

  async function handleSubmit(e: React.FormEvent, status: 'DRAFT' | 'POSTED') {
    e.preventDefault();
    setError(null);
    if (!balanced) {
      setError('Debits and credits must balance before saving.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createJournalEntry({
        date,
        memo,
        reference,
        status,
        lines: rows.map(({ key, ...rest }) => rest),
      });
      router.push(`/gl/journal-entries/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4">
      <div className="glass-card grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Reference (optional)</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} className="glass-input" placeholder="INV-1023" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Memo</label>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} className="glass-input" placeholder="What is this entry for?" />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th className="w-2/5">Account</th>
              <th>Description</th>
              <th className="w-32 text-right">Debit</th>
              <th className="w-32 text-right">Credit</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <select
                    value={row.accountId}
                    onChange={(e) => updateRow(row.key, { accountId: e.target.value })}
                    className="glass-select"
                  >
                    <option value="" className="bg-base-800">
                      Select account…
                    </option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id} className="bg-base-800">
                        {a.code} · {a.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={row.description}
                    onChange={(e) => updateRow(row.key, { description: e.target.value })}
                    className="glass-input"
                    placeholder="Optional"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.debit || ''}
                    onChange={(e) => updateRow(row.key, { debit: Number(e.target.value) || 0, credit: 0 })}
                    className="glass-input text-right"
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.credit || ''}
                    onChange={(e) => updateRow(row.key, { credit: Number(e.target.value) || 0, debit: 0 })}
                    className="glass-input text-right"
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <button type="button" className="icon-btn hover:!bg-red-500/15 hover:!text-red-300" onClick={() => removeRow(row.key)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <button type="button" className="btn-secondary !py-2" onClick={() => setRows((rs) => [...rs, emptyRow()])}>
                  <Plus className="h-3.5 w-3.5" /> Add Line
                </button>
              </td>
              <td className="text-right font-mono text-white/80">{formatCurrency(totalDebit)}</td>
              <td className="text-right font-mono text-white/80">{formatCurrency(totalCredit)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className={balanced ? 'text-sm text-emerald-400' : 'text-sm text-amber-400'}>
          {balanced ? 'Balanced' : `Out of balance by ${formatCurrency(Math.abs(totalDebit - totalCredit))}`}
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button type="button" disabled={submitting} className="btn-secondary" onClick={(e) => handleSubmit(e, 'DRAFT')}>
            Save as Draft
          </button>
          <button type="button" disabled={submitting} className="btn-primary" onClick={(e) => handleSubmit(e, 'POSTED')}>
            Post Entry
          </button>
        </div>
      </div>
    </form>
  );
}
