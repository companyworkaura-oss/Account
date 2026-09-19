import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { InvoiceForm } from './InvoiceForm';

export const dynamic = 'force-dynamic';

export default async function NewPurchaseInvoicePage() {
  const vendors = await prisma.vendor.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });

  return (
    <div>
      <Link href="/ap/purchase-invoices" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to purchase invoices
      </Link>
      <PageHeader title="New Purchase Invoice" breadcrumb={['Accounts Payable']} description="Record a bill from a vendor." />
      <InvoiceForm vendors={vendors} />
    </div>
  );
}
