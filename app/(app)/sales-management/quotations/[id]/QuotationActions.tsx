'use client';

import { useRouter } from 'next/navigation';
import { Send, Check, X, ArrowRightCircle } from 'lucide-react';
import { setQuotationStatus, convertQuotationToOrder } from '../../actions';

export function QuotationActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  if (status === 'DRAFT') {
    return (
      <button className="btn-secondary" onClick={() => setQuotationStatus(id, 'SENT')}>
        <Send className="h-4 w-4" /> Mark as Sent
      </button>
    );
  }

  if (status === 'SENT') {
    return (
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={() => setQuotationStatus(id, 'REJECTED')}>
          <X className="h-4 w-4" /> Reject
        </button>
        <button className="btn-primary" onClick={() => setQuotationStatus(id, 'ACCEPTED')}>
          <Check className="h-4 w-4" /> Accept
        </button>
      </div>
    );
  }

  if (status === 'ACCEPTED') {
    return (
      <button
        className="btn-primary"
        onClick={async () => {
          const orderId = await convertQuotationToOrder(id);
          router.push(`/sales-management/orders/${orderId}`);
        }}
      >
        <ArrowRightCircle className="h-4 w-4" /> Convert to Sales Order
      </button>
    );
  }

  return null;
}
