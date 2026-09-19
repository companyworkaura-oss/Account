import { Store } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function POSPage() {
  return (
    <ModulePlaceholder
      title="Point of Sale (POS)"
      breadcrumb={['Advanced / Optional']}
      description="A checkout screen for in-person sales that posts straight to the ledger."
      icon={Store}
      features={['Checkout screen', 'Cash drawer sessions', 'Receipt printing', 'Auto-post sales to GL']}
    />
  );
}
