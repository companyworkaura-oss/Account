import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { JournalEntryForm } from './JournalEntryForm';

export const dynamic = 'force-dynamic';

export default async function NewJournalEntryPage() {
  const accounts = await prisma.account.findMany({
    where: { isActive: true },
    orderBy: { code: 'asc' },
    select: { id: true, code: true, name: true },
  });

  return (
    <div>
      <Link href="/gl/journal-entries" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to journal entries
      </Link>

      <PageHeader title="New Journal Entry" breadcrumb={['General Ledger', 'Journal Entries']} description="Record a balanced double-entry transaction." />

      <JournalEntryForm accounts={accounts} />
    </div>
  );
}
