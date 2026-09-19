import { Archive } from 'lucide-react';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function FixedAssetsPage() {
  return (
    <ModulePlaceholder
      title="Fixed Assets Management"
      breadcrumb={['Financial Management']}
      description="Track the assets your business owns from purchase to disposal."
      icon={Archive}
      features={['Asset Register', 'Depreciation Calculation', 'Asset Disposal', 'Asset categories & useful life']}
    />
  );
}
