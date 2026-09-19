'use server';

import { prisma } from '@/lib/prisma';
import { nextExpenseNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {
  const employeeName = String(formData.get('employeeName') ?? '').trim();
  const date = String(formData.get('date') ?? '');
  const category = String(formData.get('category') ?? '').trim() || null;
  const amount = Number(formData.get('amount') ?? 0) || 0;
  const description = String(formData.get('description') ?? '').trim() || null;

  if (!employeeName) throw new Error('Employee name is required');
  if (!amount || amount <= 0) throw new Error('Amount must be greater than zero');

  const expenseNumber = await nextExpenseNumber();

  await prisma.expenseClaim.create({
    data: { expenseNumber, employeeName, date: new Date(date), category, amount, description },
  });

  revalidatePath('/expenses');
}

export async function setExpenseStatus(id: string, status: 'APPROVED' | 'REJECTED') {
  await prisma.expenseClaim.update({ where: { id }, data: { status } });
  revalidatePath('/expenses');
}

export async function reimburseExpense(id: string, bankAccountId: string) {
  const expense = await prisma.expenseClaim.findUniqueOrThrow({ where: { id } });
  if (expense.status !== 'APPROVED') throw new Error('Only approved expenses can be reimbursed.');

  await prisma.$transaction(async (tx) => {
    await tx.expenseClaim.update({ where: { id }, data: { status: 'REIMBURSED', bankAccountId } });
    await tx.cashTransaction.create({
      data: {
        bankAccountId,
        date: new Date(),
        type: 'WITHDRAWAL',
        amount: expense.amount,
        description: `Expense reimbursement — ${expense.employeeName} (${expense.expenseNumber})`,
        category: expense.category ?? 'Expense Reimbursement',
      },
    });
  });

  revalidatePath('/expenses');
  revalidatePath('/cash-bank/transactions');
  revalidatePath('/cash-bank/reconciliation');
  revalidatePath('/');
}

export async function deleteExpense(id: string) {
  await prisma.expenseClaim.delete({ where: { id } });
  revalidatePath('/expenses');
}
