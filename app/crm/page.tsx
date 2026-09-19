import { Contact } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function CRMPage() {
  return (
    <ModulePlaceholder
      title="CRM Integration"
      breadcrumb={['Advanced / Optional']}
      description="Sync leads, deals, and customer activity with your accounting records."
      icon={Contact}
      features={['Lead & deal sync', 'Customer activity timeline', 'Sync with external CRMs']}
    />
  );
}
