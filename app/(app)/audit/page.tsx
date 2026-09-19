import { ShieldCheck } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function AuditPage() {
  return (
    <ModulePlaceholder
      title="Audit & Compliance"
      breadcrumb={['Reporting & Compliance']}
      description="See exactly who changed what, and enforce internal controls."
      icon={ShieldCheck}
      features={['Audit Trails', 'Internal Controls', 'User activity log', 'Approval workflows']}
    />
  );
}
