import { Percent } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function TaxPage() {
  return (
    <ModulePlaceholder
      title="Tax Management"
      breadcrumb={['Financial Management']}
      description="Calculate, track, and report the taxes your business owes and collects."
      icon={Percent}
      features={['VAT/GST Calculation', 'Tax Reports', 'Withholding Tax', 'Configurable tax rates']}
    />
  );
}
