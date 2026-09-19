import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { SalesOrderForm } from './SalesOrderForm';

export const dynamic = 'force-dynamic';

export default async function NewSalesOrderPage() {
  const customers = await prisma.customer.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });

  return (
    <div>
      <Link href="/sales-management" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Sales Management
      </Link>
      <PageHeader title="New Sales Order" breadcrumb={['Inventory & Sales', 'Sales Management']} description="Confirm an order from a customer." />
      <SalesOrderForm customers={customers} />
    </div>
  );
}
