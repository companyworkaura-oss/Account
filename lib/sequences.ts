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
