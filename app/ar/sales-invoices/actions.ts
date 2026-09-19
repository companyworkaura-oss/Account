'use server';

import { prisma } from '@/lib/prisma';
import { nextSalesInvoiceNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export type InvoiceLineInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export async function createSalesInvoice(input: {
  customerId: string;
  date: string;
  dueDate: string;
  tax: number;
  notes?: string;
  lines: InvoiceLineInput[];
}) {
  const validLines = input.lines.filter((l) => l.description && l.quantity > 0);
  if (!input.customerId) throw new Error('Please select a customer.');
  if (validLines.length === 0) throw new Error('Add at least one line item.');

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = subtotal + (input.tax || 0);
  const invoiceNumber = await nextSalesInvoiceNumber();

  const invoice = await prisma.salesInvoice.create({
    data: {
      invoiceNumber,
      customerId: input.customerId,
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

  revalidatePath('/ar/sales-invoices');
  revalidatePath('/ar/aging');
  revalidatePath('/');
  return invoice.id;
}

export async function deleteSalesInvoice(id: string) {
  await prisma.salesInvoice.delete({ where: { id } });
  revalidatePath('/ar/sales-invoices');
  revalidatePath('/ar/aging');
}
