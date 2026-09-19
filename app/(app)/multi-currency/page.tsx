import { Globe } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function MultiCurrencyPage() {
  return (
    <ModulePlaceholder
      title="Multi-Currency Management"
      breadcrumb={['Reporting & Compliance']}
      description="Trade and report in more than one currency."
      icon={Globe}
      features={['Exchange Rates', 'Currency Revaluation', 'Multi-currency invoices', 'Realized/unrealized FX gain-loss']}
    />
  );
}
