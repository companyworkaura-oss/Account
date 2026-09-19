import { Building } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function MultiCompanyPage() {
  return (
    <ModulePlaceholder
      title="Multi-Company Management"
      breadcrumb={['Advanced / Optional']}
      description="Run separate books for multiple companies or branches from one workspace."
      icon={Building}
      features={['Company switcher', 'Inter-company transactions', 'Consolidated reporting']}
    />
  );
}
