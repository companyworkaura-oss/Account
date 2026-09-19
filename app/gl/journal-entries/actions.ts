'use server';

import { prisma } from '@/lib/prisma';
import { nextJournalNumber } from '@/lib/sequences';
import { revalidatePath } from 'next/cache';

export type JournalLineInput = {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
};

export async function createJournalEntry(input: {
  date: string;
  memo?: string;
  reference?: string;
  status: 'DRAFT' | 'POSTED';
  lines: JournalLineInput[];
}) {
  const validLines = input.lines.filter((l) => l.accountId && (l.debit > 0 || l.credit > 0));
  if (validLines.length < 2) {
    throw new Error('A journal entry needs at least two lines.');
  }

  const totalDebit = validLines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = validLines.reduce((s, l) => s + l.credit, 0);
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`Entry is not balanced: debits ${totalDebit.toFixed(2)} vs credits ${totalCredit.toFixed(2)}.`);
  }

  const entryNumber = await nextJournalNumber();

  const entry = await prisma.journalEntry.create({
    data: {
      entryNumber,
      date: new Date(input.date),
      memo: input.memo || null,
      reference: input.reference || null,
      status: input.status,
      lines: {
        create: validLines.map((l) => ({
          accountId: l.accountId,
          debit: l.debit,
          credit: l.credit,
          description: l.description || null,
        })),
      },
    },
  });

  revalidatePath('/gl/journal-entries');
  revalidatePath('/gl/trial-balance');
  revalidatePath('/reports/financial-statements');
  revalidatePath('/');
  return entry.id;
}

export async function deleteJournalEntry(id: string) {
  await prisma.journalEntry.delete({ where: { id } });
  revalidatePath('/gl/journal-entries');
  revalidatePath('/gl/trial-balance');
  revalidatePath('/reports/financial-statements');
  revalidatePath('/');
}
