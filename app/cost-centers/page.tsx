import { Building2 } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function CostCentersPage() {
  return (
    <ModulePlaceholder
      title="Cost Center Accounting"
      breadcrumb={['Advanced / Optional']}
      description="Allocate revenue and expense to departments or business units."
      icon={Building2}
      features={['Cost center tagging on journal lines', 'Departmental P&L', 'Allocation rules']}
    />
  );
}
