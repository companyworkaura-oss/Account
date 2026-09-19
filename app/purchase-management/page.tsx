import { ClipboardList } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function PurchaseManagementPage() {
  return (
    <ModulePlaceholder
      title="Purchase Management"
      breadcrumb={['Inventory & Sales']}
      description="Manage procurement from purchase order through goods receipt."
      icon={ClipboardList}
      features={['Purchase Orders', 'Goods Receipt', 'Supplier Management', 'Convert PO → bill in Accounts Payable']}
    />
  );
}
