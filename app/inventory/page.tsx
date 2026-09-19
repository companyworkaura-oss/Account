import { Boxes } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function InventoryPage() {
  return (
    <ModulePlaceholder
      title="Inventory / Stock Management"
      breadcrumb={['Inventory & Sales']}
      description="Track stock levels, valuation, and warehouse locations."
      icon={Boxes}
      features={['Stock Tracking', 'Valuation (FIFO/Weighted Avg)', 'Warehouse Management', 'Low-stock alerts']}
    />
  );
}
