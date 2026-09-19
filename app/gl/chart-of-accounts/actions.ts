'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { AccountType } from '@/lib/types';

export async function createAccount(formData: FormData) {
  const code = String(formData.get('code') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const type = String(formData.get('type') ?? 'ASSET') as AccountType;
  const subType = String(formData.get('subType') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim() || null;

  if (!code || !name) throw new Error('Code and name are required');

  await prisma.account.create({
    data: { code, name, type, subType, description },
  });

  revalidatePath('/gl/chart-of-accounts');
}

export async function updateAccount(id: string, formData: FormData) {
  const code = String(formData.get('code') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const type = String(formData.get('type') ?? 'ASSET') as AccountType;
  const subType = String(formData.get('subType') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim() || null;
  const isActive = formData.get('isActive') === 'on';

  await prisma.account.update({
    where: { id },
    data: { code, name, type, subType, description, isActive },
  });

  revalidatePath('/gl/chart-of-accounts');
}

export async function deleteAccount(id: string) {
  const linesCount = await prisma.journalLine.count({ where: { accountId: id } });
  if (linesCount > 0) {
    throw new Error('Cannot delete an account that has journal entries posted to it.');
  }
  await prisma.account.delete({ where: { id } });
  revalidatePath('/gl/chart-of-accounts');
}
