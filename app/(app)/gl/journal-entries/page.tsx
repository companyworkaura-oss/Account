import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function JournalEntriesPage() {
  const entries = await prisma.journalEntry.findMany({
    include: { lines: true },
    orderBy: { date: 'desc' },
  });

  return (
    <div>
      <PageHeader
        title="Journal Entries"
        breadcrumb={['General Ledger']}
        description="Every double-entry transaction recorded in the ledger."
        actions={
          <Link href="/gl/journal-entries/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New Journal Entry
          </Link>
        }
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Entry #</th>
              <th>Date</th>
              <th>Memo</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-white/40">
                  No journal entries yet. Create your first entry to get started.
                </td>
              </tr>
            )}
            {entries.map((e) => {
              const debit = e.lines.reduce((s, l) => s + l.debit, 0);
              const credit = e.lines.reduce((s, l) => s + l.credit, 0);
              return (
                <tr key={e.id} className="cursor-pointer">
                  <td className="font-medium text-white">
                    <Link href={`/gl/journal-entries/${e.id}`} className="hover:text-accent-400">
                      {e.entryNumber}
                    </Link>
                  </td>
                  <td className="text-white/60">{formatDate(e.date)}</td>
                  <td className="text-white/60">{e.memo ?? '—'}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(debit)}</td>
                  <td className="text-right font-mono text-white/80">{formatCurrency(credit)}</td>
                  <td>
                    <StatusPill status={e.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
