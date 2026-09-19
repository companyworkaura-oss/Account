import { prisma } from '@/lib/prisma';

async function nextSequence(prefix: string, count: number) {
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
}

export async function nextJournalNumber() {
  const count = await prisma.journalEntry.count();
  return nextSequence('JE', count);
}

export async function nextPurchaseInvoiceNumber() {
  const count = await prisma.purchaseInvoice.count();
  return nextSequence('PINV', count);
}

export async function nextSalesInvoiceNumber() {
  const count = await prisma.salesInvoice.count();
  return nextSequence('SINV', count);
}

export async function nextPaymentNumber() {
  const count = await prisma.payment.count();
  return nextSequence('PAY', count);
}

export async function nextReceiptNumber() {
  const count = await prisma.receipt.count();
  return nextSequence('RCT', count);
}

export async function nextExpenseNumber() {
  const count = await prisma.expenseClaim.count();
  return nextSequence('EXP', count);
}

export async function nextQuoteNumber() {
  const count = await prisma.quotation.count();
  return nextSequence('QUO', count);
}

export async function nextSalesOrderNumber() {
  const count = await prisma.salesOrder.count();
  return nextSequence('SO', count);
}

export async function nextDeliveryNumber() {
  const count = await prisma.deliveryNote.count();
  return nextSequence('DN', count);
}

export async function nextPurchaseOrderNumber() {
  const count = await prisma.purchaseOrder.count();
  return nextSequence('PO', count);
}

export async function nextGoodsReceiptNumber() {
  const count = await prisma.goodsReceipt.count();
  return nextSequence('GR', count);
}

export async function nextPOSSaleNumber() {
  const count = await prisma.pOSSale.count();
  return nextSequence('POS', count);
}
