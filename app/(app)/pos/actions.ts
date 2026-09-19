'use server';

import { prisma } from '@/lib/prisma';
import { nextPOSSaleNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export type POSLineInput = { itemId?: string; description: string; quantity: number; unitPrice: number };

export async function completeSale(input: {
  bankAccountId: string;
  customerName?: string;
  tax: number;
  amountTendered: number;
  lines: POSLineInput[];
}) {
  const validLines = input.lines.filter((l) => l.description && l.quantity > 0);
  if (!input.bankAccountId) throw new Error('Select a payment account.');
  if (validLines.length === 0) throw new Error('Add at least one item.');

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const total = subtotal + (input.tax || 0);
  const changeGiven = Math.max(0, (input.amountTendered || total) - total);
  const saleNumber = await nextPOSSaleNumber();

  await prisma.$transaction(async (tx) => {
    await tx.pOSSale.create({
      data: {
        saleNumber,
        customerName: input.customerName || null,
        bankAccountId: input.bankAccountId,
        subtotal,
        tax: input.tax || 0,
        total,
        amountTendered: input.amountTendered || total,
        changeGiven,
        lines: {
          create: validLines.map((l) => ({
            itemId: l.itemId || null,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            amount: l.quantity * l.unitPrice,
          })),
        },
      },
    });

    await tx.cashTransaction.create({
      data: {
        bankAccountId: input.bankAccountId,
        date: new Date(),
        type: 'DEPOSIT',
        amount: total,
        description: `POS sale ${saleNumber}${input.customerName ? ` — ${input.customerName}` : ''}`,
        category: 'POS Sale',
      },
    });

    for (const line of validLines) {
      if (!line.itemId) continue;
      const item = await tx.item.findUnique({ where: { id: line.itemId } });
      if (!item) continue;
      await tx.stockMovement.create({
        data: { itemId: line.itemId, date: new Date(), type: 'OUT', quantity: line.quantity, reference: saleNumber },
      });
      await tx.item.update({ where: { id: line.itemId }, data: { quantityOnHand: item.quantityOnHand - line.quantity } });
    }
  });

  revalidatePath('/pos');
  revalidatePath('/cash-bank/transactions');
  revalidatePath('/inventory');
  revalidatePath('/');
}
