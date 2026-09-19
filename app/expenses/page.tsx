import { Receipt } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function ExpensesPage() {
  return (
    <ModulePlaceholder
      title="Expense Management"
      breadcrumb={['Financial Management']}
      description="Let employees submit expenses and route them for approval and reimbursement."
      icon={Receipt}
      features={['Expense Claims', 'Approvals', 'Reimbursements', 'Receipt attachments']}
    />
  );
}
