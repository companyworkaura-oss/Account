import { FolderKanban } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function ProjectAccountingPage() {
  return (
    <ModulePlaceholder
      title="Project Accounting"
      breadcrumb={['Advanced / Optional']}
      description="Track income and cost per project or job."
      icon={FolderKanban}
      features={['Project budgets', 'Time & cost tracking', 'Project profitability', 'Billable vs non-billable']}
    />
  );
}
