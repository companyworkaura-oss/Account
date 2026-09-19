import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { DeleteEntryButton } from './DeleteEntryButton';

export const dynamic = 'force-dynamic';

export default async function JournalEntryDetailPage({ params }: { params: { id: string } }) {
  const entry = await prisma.journalEntry.findUnique({
    where: { id: params.id },
    include: { lines: { include: { account: true } } },
  });

  if (!entry) notFound();

  const totalDebit = entry.lines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = entry.lines.reduce((s, l) => s + l.credit, 0);

  return (
    <div>
      <Link href="/gl/journal-entries" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to journal entries
      </Link>

      <PageHeader
        title={entry.entryNumber}
        breadcrumb={['General Ledger', 'Journal Entries']}
        description={entry.memo ?? undefined}
        actions={
          <>
            <StatusPill status={entry.status} />
            <DeleteEntryButton id={entry.id} />
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card !p-4">
          <p className="text-xs text-white/40">Date</p>
          <p className="mt-1 text-sm font-medium text-white">{formatDate(entry.date)}</p>
        </div>
        <div className="glass-card !p-4">
          <p className="text-xs text-white/40">Reference</p>
          <p className="mt-1 text-sm font-medium text-white">{entry.reference ?? '—'}</p>
        </div>
        <div className="glass-card !p-4">
          <p className="text-xs text-white/40">Total Debit</p>
          <p className="mt-1 text-sm font-medium text-white">{formatCurrency(totalDebit)}</p>
        </div>
        <div className="glass-card !p-4">
          <p className="text-xs text-white/40">Total Credit</p>
          <p className="mt-1 text-sm font-medium text-white">{formatCurrency(totalCredit)}</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Account</th>
              <th>Description</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {entry.lines.map((l) => (
              <tr key={l.id}>
                <td className="font-medium text-white">
                  {l.account.code} · {l.account.name}
                </td>
                <td className="text-white/50">{l.description ?? '—'}</td>
                <td className="text-right font-mono text-white/80">{l.debit ? formatCurrency(l.debit) : '—'}</td>
                <td className="text-right font-mono text-white/80">{l.credit ? formatCurrency(l.credit) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
