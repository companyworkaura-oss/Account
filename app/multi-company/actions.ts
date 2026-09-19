'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCompany(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim() || null;
  const currency = String(formData.get('currency') ?? 'USD').trim() || 'USD';
  const taxId = String(formData.get('taxId') ?? '').trim() || null;
  if (!name) throw new Error('Company name is required');

  const count = await prisma.company.count();
  await prisma.company.create({ data: { name, address, currency, taxId, isActive: count === 0 } });
  revalidatePath('/multi-company');
}

export async function setActiveCompany(id: string) {
  await prisma.$transaction([
    prisma.company.updateMany({ data: { isActive: false } }),
    prisma.company.update({ where: { id }, data: { isActive: true } }),
  ]);
  revalidatePath('/multi-company');
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } });
  revalidatePath('/multi-company');
}
