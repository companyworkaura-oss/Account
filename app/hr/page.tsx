import { Users } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function HRPage() {
  return (
    <ModulePlaceholder
      title="Employee Management (HR)"
      breadcrumb={['Payroll & HR']}
      description="Keep employee records and manage leave, feeding directly into Payroll."
      icon={Users}
      features={['Employee Records', 'Leave Management', 'Org chart', 'Document storage']}
    />
  );
}
