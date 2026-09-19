'use server';

import { prisma } from '@/lib/prisma';
import { nextPaymentNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';
import { PaymentMethod } from '@/lib/types';

export async function recordPayment(input: {
  vendorId: string;
  purchaseInvoiceId?: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}) {
  if (!input.vendorId) throw new Error('Please select a vendor.');
  if (!input.amount || input.amount <= 0) throw new Error('Amount must be greater than zero.');

  const paymentNumber = await nextPaymentNumber();

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        paymentNumber,
        vendorId: input.vendorId,
        purchaseInvoiceId: input.purchaseInvoiceId || null,
        date: new Date(input.date),
        amount: input.amount,
        method: input.method,
        reference: input.reference || null,
        notes: input.notes || null,
      },
    });

    if (input.purchaseInvoiceId) {
      const invoice = await tx.purchaseInvoice.findUniqueOrThrow({ where: { id: input.purchaseInvoiceId } });
      const newAmountPaid = invoice.amountPaid + input.amount;
      const status = newAmountPaid >= invoice.total - 0.01 ? 'PAID' : newAmountPaid > 0 ? 'PARTIAL' : 'UNPAID';
      await tx.purchaseInvoice.update({
        where: { id: input.purchaseInvoiceId },
        data: { amountPaid: newAmountPaid, status },
      });
    }
  });

  revalidatePath('/ap/payments');
  revalidatePath('/ap/purchase-invoices');
  revalidatePath('/ap/aging');
  revalidatePath('/ap/vendors');
  revalidatePath('/');
}
