import { Factory } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function ManufacturingPage() {
  return (
    <ModulePlaceholder
      title="Manufacturing / Production Accounting"
      breadcrumb={['Advanced / Optional']}
      description="Cost bills of materials and track work-in-progress through production."
      icon={Factory}
      features={['Bill of Materials', 'Work Orders', 'WIP costing', 'Production variance']}
    />
  );
}
