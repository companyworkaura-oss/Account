'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAsset(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim() || null;
  const purchaseDate = String(formData.get('purchaseDate') ?? '');
  const purchaseCost = Number(formData.get('purchaseCost') ?? 0) || 0;
  const salvageValue = Number(formData.get('salvageValue') ?? 0) || 0;
  const usefulLifeYears = Number(formData.get('usefulLifeYears') ?? 1) || 1;
  const notes = String(formData.get('notes') ?? '').trim() || null;

  if (!name) throw new Error('Asset name is required');
  if (!purchaseDate) throw new Error('Purchase date is required');

  await prisma.asset.create({
    data: { name, category, purchaseDate: new Date(purchaseDate), purchaseCost, salvageValue, usefulLifeYears, notes },
  });

  revalidatePath('/fixed-assets');
}

export async function recordDepreciation(id: string) {
  const asset = await prisma.asset.findUniqueOrThrow({ where: { id } });
  if (asset.status !== 'ACTIVE') throw new Error('Cannot depreciate a disposed asset.');

  const depreciableBase = asset.purchaseCost - asset.salvageValue;
  const monthlyDepreciation = depreciableBase / (asset.usefulLifeYears * 12);
  const remaining = depreciableBase - asset.accumulatedDepreciation;
  const amount = Math.max(0, Math.min(monthlyDepreciation, remaining));

  if (amount <= 0) throw new Error('This asset is already fully depreciated.');

  await prisma.asset.update({
    where: { id },
    data: { accumulatedDepreciation: asset.accumulatedDepreciation + amount },
  });

  revalidatePath('/fixed-assets');
}

export async function disposeAsset(id: string, input: { date: string; amount: number }) {
  await prisma.asset.update({
    where: { id },
    data: { status: 'DISPOSED', disposalDate: new Date(input.date), disposalAmount: input.amount },
  });
  revalidatePath('/fixed-assets');
}

export async function deleteAsset(id: string) {
  await prisma.asset.delete({ where: { id } });
  revalidatePath('/fixed-assets');
}
