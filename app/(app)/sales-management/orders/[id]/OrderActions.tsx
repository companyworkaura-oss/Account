'use client';

import { useRouter } from 'next/navigation';
import { Check, FileText } from 'lucide-react';
import { setSalesOrderStatus, convertOrderToInvoice } from '../../actions';
import { CreateDeliveryNoteButton } from './DeliveryNoteDialog';

export function OrderActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {status === 'PENDING' && (
        <button className="btn-secondary" onClick={() => setSalesOrderStatus(id, 'CONFIRMED')}>
          <Check className="h-4 w-4" /> Confirm Order
        </button>
      )}
      {(status === 'CONFIRMED' || status === 'DELIVERED') && <CreateDeliveryNoteButton salesOrderId={id} />}
      {status !== 'INVOICED' && status !== 'PENDING' && (
        <button
          className="btn-primary"
          onClick={async () => {
            const invoiceId = await convertOrderToInvoice(id);
            router.push(`/ar/sales-invoices/${invoiceId}`);
          }}
        >
          <FileText className="h-4 w-4" /> Convert to Invoice
        </button>
      )}
    </div>
  );
}
