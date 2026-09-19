'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { CashTxnType } from '@/lib/types';

export async function createBankAccount(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const bankName = String(formData.get('bankName') ?? '').trim() || null;
  const accountNumber = String(formData.get('accountNumber') ?? '').trim() || null;
  const openingBalance = Number(formData.get('openingBalance') ?? 0) || 0;
  if (!name) throw new Error('Account name is required');

  await prisma.bankAccount.create({ data: { name, bankName, accountNumber, openingBalance } });
  revalidatePath('/cash-bank/transactions');
  revalidatePath('/cash-bank/transfers');
  revalidatePath('/cash-bank/reconciliation');
  revalidatePath('/');
}

export async function createCashTransaction(input: {
  bankAccountId: string;
  date: string;
  type: CashTxnType;
  amount: number;
  description?: string;
  category?: string;
}) {
  if (!input.bankAccountId) throw new Error('Select an account.');
  if (!input.amount || input.amount <= 0) throw new Error('Amount must be greater than zero.');

  await prisma.cashTransaction.create({
    data: {
      bankAccountId: input.bankAccountId,
      date: new Date(input.date),
      type: input.type,
      amount: input.amount,
      description: input.description || null,
      category: input.category || null,
    },
  });

  revalidatePath('/cash-bank/transactions');
  revalidatePath('/cash-bank/reconciliation');
  revalidatePath('/');
}

export async function deleteCashTransaction(id: string) {
  await prisma.cashTransaction.delete({ where: { id } });
  revalidatePath('/cash-bank/transactions');
  revalidatePath('/cash-bank/reconciliation');
  revalidatePath('/');
}

export async function toggleReconciled(id: string, reconciled: boolean) {
  await prisma.cashTransaction.update({ where: { id }, data: { reconciled } });
  revalidatePath('/cash-bank/reconciliation');
}

export async function createBankTransfer(input: {
  date: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  notes?: string;
}) {
  if (input.fromAccountId === input.toAccountId) throw new Error('Choose two different accounts.');
  if (!input.amount || input.amount <= 0) throw new Error('Amount must be greater than zero.');

  await prisma.$transaction(async (tx) => {
    await tx.bankTransfer.create({
      data: {
        date: new Date(input.date),
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        amount: input.amount,
        notes: input.notes || null,
      },
    });
    await tx.cashTransaction.create({
      data: {
        bankAccountId: input.fromAccountId,
        date: new Date(input.date),
        type: 'TRANSFER_OUT',
        amount: input.amount,
        description: `Transfer to another account${input.notes ? ` — ${input.notes}` : ''}`,
      },
    });
    await tx.cashTransaction.create({
      data: {
        bankAccountId: input.toAccountId,
        date: new Date(input.date),
        type: 'TRANSFER_IN',
        amount: input.amount,
        description: `Transfer from another account${input.notes ? ` — ${input.notes}` : ''}`,
      },
    });
  });

  revalidatePath('/cash-bank/transfers');
  revalidatePath('/cash-bank/transactions');
  revalidatePath('/cash-bank/reconciliation');
  revalidatePath('/');
}
