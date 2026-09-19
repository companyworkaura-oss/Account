'use server';

import { prisma } from '@/lib/prisma';
import { nextPurchaseInvoiceNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export type InvoiceLineInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export async function createPurchaseInvoice(input: {
  vendorId: string;
  date: string;
  dueDate: string;
  tax: number;
  notes?: string;
  lines: InvoiceLineInput[];
}) {
  const validLines = input.lines.filter((l) => l.description && l.quantity > 0);
  if (!input.vendorId) throw new Error('Please select a vendor.');
  if (validLines.length === 0) throw new Error('Add at least one line item.');

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = subtotal + (input.tax || 0);
  const invoiceNumber = await nextPurchaseInvoiceNumber();

  const invoice = await prisma.purchaseInvoice.create({
    data: {
      invoiceNumber,
      vendorId: input.vendorId,
      date: new Date(input.date),
      dueDate: new Date(input.dueDate),
      status: 'UNPAID',
      subtotal,
      tax: input.tax || 0,
      total,
      notes: input.notes || null,
      lines: {
        create: validLines.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          amount: l.quantity * l.unitPrice,
        })),
      },
    },
  });

  revalidatePath('/ap/purchase-invoices');
  revalidatePath('/ap/aging');
  revalidatePath('/');
  return invoice.id;
}

export async function deletePurchaseInvoice(id: string) {
  await prisma.purchaseInvoice.delete({ where: { id } });
  revalidatePath('/ap/purchase-invoices');
  revalidatePath('/ap/aging');
}
