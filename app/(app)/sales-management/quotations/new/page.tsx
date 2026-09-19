import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { QuotationForm } from './QuotationForm';

export const dynamic = 'force-dynamic';

export default async function NewQuotationPage() {
  const customers = await prisma.customer.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });

  return (
    <div>
      <Link href="/sales-management" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Sales Management
      </Link>
      <PageHeader title="New Quotation" breadcrumb={['Inventory & Sales', 'Sales Management']} description="Send a customer a price quote." />
      <QuotationForm customers={customers} />
    </div>
  );
}
