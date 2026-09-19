'use client';

import { useState } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { completeSale, type POSLineInput } from './actions';
import { formatCurrency } from '@/lib/format';

type Account = { id: string; name: string };
type Item = { id: string; sku: string; name: string; unitPrice: number };
type Row = POSLineInput & { key: string };

function emptyRow(): Row {
  return { key: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 };
}

export function POSForm({ accounts, items }: { accounts: Account[]; items: Item[] }) {
  const [bankAccountId, setBankAccountId] = useState(accounts[0]?.id ?? '');
  const [customerName, setCustomerName] = useState('');
  const [tax, setTax] = useState(0);
  const [amountTendered, setAmountTendered] = useState(0);
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = rows.reduce((s, r) => s + r.quantity * r.unitPrice, 0);
  const total = subtotal + (Number(tax) || 0);
  const change = Math.max(0, (Number(amountTendered) || 0) - total);

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function selectItem(key: string, itemId: string) {
    const item = items.find((i) => i.id === itemId);
    if (item) updateRow(key, { itemId: item.id, description: `${item.name} (${item.sku})`, unitPrice: item.unitPrice });
    else updateRow(key, { itemId: undefined });
  }

  async function handleCheckout() {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await completeSale({ bankAccountId, customerName, tax: Number(tax) || 0, amountTendered: Number(amountTendered) || total, lines: rows.map(({ key, ...rest }) => rest) });
      setSuccess('Sale completed.');
      setRows([emptyRow()]);
      setTax(0);
      setAmountTendered(0);
      setCustomerName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Payment Account</label>
          <select value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)} className="glass-select">
            {accounts.map((a) => (
              <option key={a.id} value={a.id} className="bg-base-800">{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Customer (optional)</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="glass-input" placeholder="Walk-in" />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr><th>Item</th><th>Description</th><th className="w-24 text-right">Qty</th><th className="w-32 text-right">Price</th><th className="w-32 text-right">Amount</th><th className="w-10" /></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <select value={row.itemId ?? ''} onChange={(e) => selectItem(row.key, e.target.value)} className="glass-select">
                    <option value="" className="bg-base-800">Manual entry</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id} className="bg-base-800">{i.sku} · {i.name}</option>
                    ))}
                  </select>
                </td>
                <td><input value={row.description} onChange={(e) => updateRow(row.key, { description: e.target.value })} className="glass-input" placeholder="Description" /></td>
                <td><input type="number" min={0} step="1" value={row.quantity} onChange={(e) => updateRow(row.key, { quantity: Number(e.target.value) || 0 })} className="glass-input text-right" /></td>
                <td><input type="number" min={0} step="0.01" value={row.unitPrice} onChange={(e) => updateRow(row.key, { unitPrice: Number(e.target.value) || 0 })} className="glass-input text-right" /></td>
                <td className="text-right font-mono text-white/80">{formatCurrency(row.quantity * row.unitPrice)}</td>
                <td><button type="button" className="icon-btn hover:!bg-red-500/15 hover:!text-red-300" onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== row.key) : rs))}><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}><button type="button" className="btn-secondary !py-2" onClick={() => setRows((rs) => [...rs, emptyRow()])}><Plus className="h-3.5 w-3.5" /> Add Item</button></td>
              <td className="text-right text-white/50">Subtotal</td>
              <td className="text-right font-mono text-white/80">{formatCurrency(subtotal)}</td>
              <td />
            </tr>
            <tr>
              <td colSpan={3} />
              <td className="text-right text-white/50">Tax</td>
              <td className="text-right"><input type="number" min={0} step="0.01" value={tax} onChange={(e) => setTax(Number(e.target.value) || 0)} className="glass-input text-right" /></td>
              <td />
            </tr>
            <tr>
              <td colSpan={3} />
              <td className="text-right font-semibold text-white">Total</td>
              <td className="text-right font-mono font-semibold text-white">{formatCurrency(total)}</td>
              <td />
            </tr>
            <tr>
              <td colSpan={3} />
              <td className="text-right text-white/50">Tendered</td>
              <td className="text-right"><input type="number" min={0} step="0.01" value={amountTendered} onChange={(e) => setAmountTendered(Number(e.target.value) || 0)} className="glass-input text-right" placeholder={total.toFixed(2)} /></td>
              <td />
            </tr>
            <tr>
              <td colSpan={3} />
              <td className="text-right text-white/50">Change</td>
              <td className="text-right font-mono text-emerald-400">{formatCurrency(change)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}
        </div>
        <button onClick={handleCheckout} disabled={submitting || !bankAccountId} className="btn-primary">
          <ShoppingCart className="h-4 w-4" /> Complete Sale
        </button>
      </div>
    </div>
  );
}
