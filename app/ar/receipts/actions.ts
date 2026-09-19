'use server';

import { prisma } from '@/lib/prisma';
import { nextReceiptNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';
import { PaymentMethod } from '@/lib/types';

export async function recordReceipt(input: {
  customerId: string;
  salesInvoiceId?: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}) {
  if (!input.customerId) throw new Error('Please select a customer.');
  if (!input.amount || input.amount <= 0) throw new Error('Amount must be greater than zero.');

  const receiptNumber = await nextReceiptNumber();

  await prisma.$transaction(async (tx) => {
    await tx.receipt.create({
      data: {
        receiptNumber,
        customerId: input.customerId,
        salesInvoiceId: input.salesInvoiceId || null,
        date: new Date(input.date),
        amount: input.amount,
        method: input.method,
        reference: input.reference || null,
        notes: input.notes || null,
      },
    });

    if (input.salesInvoiceId) {
      const invoice = await tx.salesInvoice.findUniqueOrThrow({ where: { id: input.salesInvoiceId } });
      const newAmountPaid = invoice.amountPaid + input.amount;
      const status = newAmountPaid >= invoice.total - 0.01 ? 'PAID' : newAmountPaid > 0 ? 'PARTIAL' : 'UNPAID';
      await tx.salesInvoice.update({
        where: { id: input.salesInvoiceId },
        data: { amountPaid: newAmountPaid, status },
      });
    }
  });

  revalidatePath('/ar/receipts');
  revalidatePath('/ar/sales-invoices');
  revalidatePath('/ar/aging');
  revalidatePath('/ar/customers');
  revalidatePath('/');
}
