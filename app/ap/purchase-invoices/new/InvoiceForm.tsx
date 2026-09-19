'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createPurchaseInvoice, type InvoiceLineInput } from '../actions';
import { formatCurrency, formatDateInput } from '@/lib/format';

type Vendor = { id: string; name: string };
type Row = InvoiceLineInput & { key: string };

function emptyRow(): Row {
  return { key: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 };
}

export function InvoiceForm({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const [vendorId, setVendorId] = useState('');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [dueDate, setDueDate] = useState(formatDateInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = rows.reduce((s, r) => s + r.quantity * r.unitPrice, 0);
  const total = subtotal + (Number(tax) || 0);

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const id = await createPurchaseInvoice({
        vendorId,
        date,
        dueDate,
        tax: Number(tax) || 0,
        notes,
        lines: rows.map(({ key, ...rest }) => rest),
      });
      router.push(`/ap/purchase-invoices/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="glass-card grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Vendor</label>
          <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} required className="glass-select">
            <option value="" className="bg-base-800">Select vendor…</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id} className="bg-base-800">{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Invoice Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="glass-input" required />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Description</th>
              <th className="w-24 text-right">Qty</th>
              <th className="w-32 text-right">Unit Price</th>
              <th className="w-32 text-right">Amount</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <input value={row.description} onChange={(e) => updateRow(row.key, { description: e.target.value })} className="glass-input" placeholder="Item or service" />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={row.quantity} onChange={(e) => updateRow(row.key, { quantity: Number(e.target.value) || 0 })} className="glass-input text-right" />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={row.unitPrice} onChange={(e) => updateRow(row.key, { unitPrice: Number(e.target.value) || 0 })} className="glass-input text-right" />
                </td>
                <td className="text-right font-mono text-white/80">{formatCurrency(row.quantity * row.unitPrice)}</td>
                <td>
                  <button type="button" className="icon-btn hover:!bg-red-500/15 hover:!text-red-300" onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== row.key) : rs))}>
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
              <td className="text-right text-white/50">Subtotal</td>
              <td className="text-right font-mono text-white/80">{formatCurrency(subtotal)}</td>
              <td />
            </tr>
            <tr>
              <td colSpan={2} />
              <td className="text-right text-white/50">Tax</td>
              <td className="text-right">
                <input type="number" min={0} step="0.01" value={tax} onChange={(e) => setTax(Number(e.target.value) || 0)} className="glass-input text-right" />
              </td>
              <td />
            </tr>
            <tr>
              <td colSpan={2} />
              <td className="text-right font-semibold text-white">Total</td>
              <td className="text-right font-mono font-semibold text-white">{formatCurrency(total)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="glass-card">
        <label className="mb-1 block text-xs font-medium text-white/50">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input" rows={2} />
      </div>

      <div className="flex items-center justify-between">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary ml-auto">
          Save Purchase Invoice
        </button>
      </div>
    </form>
  );
}
