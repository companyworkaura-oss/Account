import { ShoppingCart } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function SalesManagementPage() {
  return (
    <ModulePlaceholder
      title="Sales Management"
      breadcrumb={['Inventory & Sales']}
      description="Manage the sales pipeline from quote to delivery, feeding straight into Sales Invoices."
      icon={ShoppingCart}
      features={['Quotations', 'Sales Orders', 'Delivery Notes', 'Convert quote → order → invoice']}
    />
  );
}
