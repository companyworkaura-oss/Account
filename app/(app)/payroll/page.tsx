import { Banknote } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function PayrollPage() {
  return (
    <ModulePlaceholder
      title="Payroll Management"
      breadcrumb={['Payroll & HR']}
      description="Run payroll, calculate deductions and taxes, and issue payslips."
      icon={Banknote}
      features={['Salary Processing', 'Deductions', 'Payslips', 'Tax Calculations']}
    />
  );
}
