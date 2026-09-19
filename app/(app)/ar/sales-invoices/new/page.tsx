import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { InvoiceForm } from './InvoiceForm';

export const dynamic = 'force-dynamic';

export default async function NewSalesInvoicePage() {
  const customers = await prisma.customer.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });

  return (
    <div>
      <Link href="/ar/sales-invoices" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to sales invoices
      </Link>
      <PageHeader title="New Sales Invoice" breadcrumb={['Accounts Receivable']} description="Bill a customer for goods or services." />
      <InvoiceForm customers={customers} />
    </div>
  );
}
