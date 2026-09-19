'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveBudget(accountId: string, year: number, amount: number) {
  await prisma.budget.upsert({
    where: { accountId_year: { accountId, year } },
    update: { amount },
    create: { accountId, year, amount },
  });
  revalidatePath('/budgeting');
}
