'use client';

import { useRouter } from 'next/navigation';
import { Send, FileText } from 'lucide-react';
import { setPurchaseOrderStatus, convertPOToInvoice } from '../actions';
import { CreateGoodsReceiptButton } from './GoodsReceiptDialog';

export function POActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {status === 'DRAFT' && (
        <button className="btn-secondary" onClick={() => setPurchaseOrderStatus(id, 'SENT')}>
          <Send className="h-4 w-4" /> Mark as Sent
        </button>
      )}
      {(status === 'SENT' || status === 'RECEIVED') && <CreateGoodsReceiptButton purchaseOrderId={id} />}
      {status !== 'INVOICED' && status !== 'DRAFT' && status !== 'CANCELLED' && (
        <button
          className="btn-primary"
          onClick={async () => {
            const invoiceId = await convertPOToInvoice(id);
            router.push(`/ap/purchase-invoices/${invoiceId}`);
          }}
        >
          <FileText className="h-4 w-4" /> Convert to Invoice
        </button>
      )}
    </div>
  );
}
