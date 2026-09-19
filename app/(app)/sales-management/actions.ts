'use server';

import { prisma } from '@/lib/prisma';
import { nextQuoteNumber, nextSalesOrderNumber, nextDeliveryNumber, nextSalesInvoiceNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export type LineInput = { description: string; quantity: number; unitPrice: number };

export async function createQuotation(input: { customerId: string; date: string; expiryDate: string; tax: number; notes?: string; lines: LineInput[] }) {
  const validLines = input.lines.filter((l) => l.description && l.quantity > 0);
  if (!input.customerId) throw new Error('Please select a customer.');
  if (validLines.length === 0) throw new Error('Add at least one line item.');

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = subtotal + (input.tax || 0);
  const quoteNumber = await nextQuoteNumber();

  const quotation = await prisma.quotation.create({
    data: {
      quoteNumber,
      customerId: input.customerId,
      date: new Date(input.date),
      expiryDate: new Date(input.expiryDate),
      subtotal,
      tax: input.tax || 0,
      total,
      notes: input.notes || null,
      lines: { create: validLines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.quantity * l.unitPrice })) },
    },
  });

  revalidatePath('/sales-management');
  return quotation.id;
}

export async function setQuotationStatus(id: string, status: 'SENT' | 'ACCEPTED' | 'REJECTED') {
  await prisma.quotation.update({ where: { id }, data: { status } });
  revalidatePath('/sales-management');
}

export async function convertQuotationToOrder(id: string) {
  const quote = await prisma.quotation.findUniqueOrThrow({ where: { id }, include: { lines: true } });
  const orderNumber = await nextSalesOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.salesOrder.create({
      data: {
        orderNumber,
        customerId: quote.customerId,
        date: new Date(),
        subtotal: quote.subtotal,
        tax: quote.tax,
        total: quote.total,
        notes: quote.notes,
        lines: { create: quote.lines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.amount, itemId: l.itemId })) },
      },
    });
    await tx.quotation.update({ where: { id }, data: { status: 'CONVERTED' } });
    return created;
  });

  revalidatePath('/sales-management');
  return order.id;
}

export async function createSalesOrder(input: { customerId: string; date: string; tax: number; notes?: string; lines: LineInput[] }) {
  const validLines = input.lines.filter((l) => l.description && l.quantity > 0);
  if (!input.customerId) throw new Error('Please select a customer.');
  if (validLines.length === 0) throw new Error('Add at least one line item.');

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = subtotal + (input.tax || 0);
  const orderNumber = await nextSalesOrderNumber();

  const order = await prisma.salesOrder.create({
    data: {
      orderNumber,
      customerId: input.customerId,
      date: new Date(input.date),
      subtotal,
      tax: input.tax || 0,
      total,
      notes: input.notes || null,
      lines: { create: validLines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.quantity * l.unitPrice })) },
    },
  });

  revalidatePath('/sales-management');
  return order.id;
}

export async function setSalesOrderStatus(id: string, status: 'CONFIRMED' | 'CANCELLED') {
  await prisma.salesOrder.update({ where: { id }, data: { status } });
  revalidatePath('/sales-management');
}

export async function createDeliveryNote(salesOrderId: string, input: { date: string; notes?: string }) {
  const deliveryNumber = await nextDeliveryNumber();

  await prisma.$transaction(async (tx) => {
    await tx.deliveryNote.create({
      data: { deliveryNumber, salesOrderId, date: new Date(input.date), status: 'DELIVERED', notes: input.notes || null },
    });
    await tx.salesOrder.update({ where: { id: salesOrderId }, data: { status: 'DELIVERED' } });
  });

  revalidatePath('/sales-management');
}

export async function convertOrderToInvoice(id: string) {
  const order = await prisma.salesOrder.findUniqueOrThrow({ where: { id }, include: { lines: true } });
  const invoiceNumber = await nextSalesInvoiceNumber();

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.salesInvoice.create({
      data: {
        invoiceNumber,
        customerId: order.customerId,
        date: new Date(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'UNPAID',
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        notes: order.notes,
        lines: { create: order.lines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.amount })) },
      },
    });
    await tx.salesOrder.update({ where: { id }, data: { status: 'INVOICED' } });
    return created;
  });

  revalidatePath('/sales-management');
  revalidatePath('/ar/sales-invoices');
  revalidatePath('/');
  return invoice.id;
}
