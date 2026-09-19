'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createItem(formData: FormData) {
  const sku = String(formData.get('sku') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const unit = String(formData.get('unit') ?? 'pcs').trim() || 'pcs';
  const costPrice = Number(formData.get('costPrice') ?? 0) || 0;
  const unitPrice = Number(formData.get('unitPrice') ?? 0) || 0;
  const quantityOnHand = Number(formData.get('quantityOnHand') ?? 0) || 0;
  const reorderLevel = Number(formData.get('reorderLevel') ?? 0) || 0;
  const description = String(formData.get('description') ?? '').trim() || null;

  if (!sku) throw new Error('SKU is required');
  if (!name) throw new Error('Item name is required');

  await prisma.item.create({
    data: { sku, name, unit, costPrice, unitPrice, quantityOnHand, reorderLevel, description },
  });

  revalidatePath('/inventory');
}

export async function adjustStock(itemId: string, input: { date: string; type: 'IN' | 'OUT' | 'ADJUSTMENT'; quantity: number; reference?: string; notes?: string }) {
  if (!input.quantity || input.quantity <= 0) throw new Error('Quantity must be greater than zero.');

  await prisma.$transaction(async (tx) => {
    await tx.stockMovement.create({
      data: {
        itemId,
        date: new Date(input.date),
        type: input.type,
        quantity: input.quantity,
        reference: input.reference || null,
        notes: input.notes || null,
      },
    });

    const item = await tx.item.findUniqueOrThrow({ where: { id: itemId } });
    const delta = input.type === 'OUT' ? -input.quantity : input.quantity;
    await tx.item.update({ where: { id: itemId }, data: { quantityOnHand: item.quantityOnHand + delta } });
  });

  revalidatePath('/inventory');
  revalidatePath(`/inventory/${itemId}`);
}

export async function deleteItem(id: string) {
  await prisma.item.delete({ where: { id } });
  revalidatePath('/inventory');
}
