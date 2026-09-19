import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';
import { PurchaseOrderForm } from './PurchaseOrderForm';

export const dynamic = 'force-dynamic';

export default async function NewPurchaseOrderPage() {
  const vendors = await prisma.vendor.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });

  return (
    <div>
      <Link href="/purchase-management" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Purchase Management
      </Link>
      <PageHeader title="New Purchase Order" breadcrumb={['Inventory & Sales', 'Purchase Management']} description="Order goods or services from a vendor." />
      <PurchaseOrderForm vendors={vendors} />
    </div>
  );
}
