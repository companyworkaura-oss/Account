import { Target } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function BudgetingPage() {
  return (
    <ModulePlaceholder
      title="Budgeting & Forecasting"
      breadcrumb={['Financial Management']}
      description="Plan spend by account or department and track it against actuals."
      icon={Target}
      features={['Budget Creation', 'Variance Analysis', 'Rolling forecasts', 'Department/cost-center budgets']}
    />
  );
}
