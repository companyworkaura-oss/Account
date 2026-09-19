'use client';

import { useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { recordPayment } from './actions';
import { formatCurrency, formatDateInput } from '@/lib/format';

type Invoice = { id: string; invoiceNumber: string; vendorId: string; vendorName: string; balance: number };

const METHODS = ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'CARD', 'OTHER'];

export function RecordPaymentButton({
  invoices,
  presetInvoiceId,
  label = 'Record Payment',
}: {
  invoices: Invoice[];
  presetInvoiceId?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState(presetInvoiceId ?? '');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(() => invoices.find((i) => i.id === invoiceId), [invoiceId, invoices]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError('Select an invoice to pay.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await recordPayment({
        vendorId: selected.vendorId,
        purchaseInvoiceId: selected.id,
        date,
        amount,
        method: method as any,
        reference,
      });
      setOpen(false);
      setAmount(0);
      setReference('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <CreditCard className="h-4 w-4" /> {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Record Payment">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Invoice</label>
            <select
              value={invoiceId}
              onChange={(e) => {
                setInvoiceId(e.target.value);
                const inv = invoices.find((i) => i.id === e.target.value);
                if (inv) setAmount(inv.balance);
              }}
              className="glass-select"
              disabled={!!presetInvoiceId}
            >
              <option value="" className="bg-base-800">Select invoice…</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id} className="bg-base-800">
                  {inv.vendorName} · {inv.invoiceNumber} · {formatCurrency(inv.balance)} due
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Amount</label>
              <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="glass-input" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="glass-select">
                {METHODS.map((m) => (
                  <option key={m} value={m} className="bg-base-800">{m.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">Reference</label>
              <input value={reference} onChange={(e) => setReference(e.target.value)} className="glass-input" placeholder="Cheque # / Txn ID" />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">Save Payment</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
