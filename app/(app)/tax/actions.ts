'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTaxRate(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const rate = Number(formData.get('rate') ?? 0) || 0;
  const type = String(formData.get('type') ?? 'VAT');
  if (!name) throw new Error('Tax name is required');

  await prisma.taxRate.create({ data: { name, rate, type } });
  revalidatePath('/tax');
}

export async function toggleTaxRateActive(id: string, isActive: boolean) {
  await prisma.taxRate.update({ where: { id }, data: { isActive } });
  revalidatePath('/tax');
}

export async function deleteTaxRate(id: string) {
  await prisma.taxRate.delete({ where: { id } });
  revalidatePath('/tax');
}
