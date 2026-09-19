'use server';

import { prisma } from '@/lib/prisma';
import { nextPurchaseOrderNumber, nextGoodsReceiptNumber, nextPurchaseInvoiceNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export type LineInput = { description: string; quantity: number; unitPrice: number };

export async function createPurchaseOrder(input: { vendorId: string; date: string; tax: number; notes?: string; lines: LineInput[] }) {
  const validLines = input.lines.filter((l) => l.description && l.quantity > 0);
  if (!input.vendorId) throw new Error('Please select a vendor.');
  if (validLines.length === 0) throw new Error('Add at least one line item.');

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = subtotal + (input.tax || 0);
  const poNumber = await nextPurchaseOrderNumber();

  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber,
      vendorId: input.vendorId,
      date: new Date(input.date),
      subtotal,
      tax: input.tax || 0,
      total,
      notes: input.notes || null,
      lines: { create: validLines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.quantity * l.unitPrice })) },
    },
  });

  revalidatePath('/purchase-management');
  return po.id;
}

export async function setPurchaseOrderStatus(id: string, status: 'SENT' | 'CANCELLED') {
  await prisma.purchaseOrder.update({ where: { id }, data: { status } });
  revalidatePath('/purchase-management');
}

export async function createGoodsReceipt(purchaseOrderId: string, input: { date: string; notes?: string }) {
  const grNumber = await nextGoodsReceiptNumber();

  await prisma.$transaction(async (tx) => {
    await tx.goodsReceipt.create({
      data: { grNumber, purchaseOrderId, date: new Date(input.date), notes: input.notes || null },
    });
    await tx.purchaseOrder.update({ where: { id: purchaseOrderId }, data: { status: 'RECEIVED' } });
  });

  revalidatePath('/purchase-management');
}

export async function convertPOToInvoice(id: string) {
  const po = await prisma.purchaseOrder.findUniqueOrThrow({ where: { id }, include: { lines: true } });
  const invoiceNumber = await nextPurchaseInvoiceNumber();

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.purchaseInvoice.create({
      data: {
        invoiceNumber,
        vendorId: po.vendorId,
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'UNPAID',
        subtotal: po.subtotal,
        tax: po.tax,
        total: po.total,
        notes: po.notes,
        lines: { create: po.lines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.amount })) },
      },
    });
    await tx.purchaseOrder.update({ where: { id }, data: { status: 'INVOICED' } });
    return created;
  });

  revalidatePath('/purchase-management');
  revalidatePath('/ap/purchase-invoices');
  revalidatePath('/');
  return invoice.id;
}
