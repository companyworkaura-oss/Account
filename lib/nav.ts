export type NavItem = {
  label: string;
  href: string;
  status: 'live' | 'planned';
};

export type NavGroup = {
  label: string;
  icon: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: 'Core Accounting',
    icon: 'BookOpen',
    items: [
      { label: 'Chart of Accounts', href: '/gl/chart-of-accounts', status: 'live' },
      { label: 'Journal Entries', href: '/gl/journal-entries', status: 'live' },
      { label: 'Trial Balance', href: '/gl/trial-balance', status: 'live' },
      { label: 'Financial Statements', href: '/reports/financial-statements', status: 'live' },
    ],
  },
  {
    label: 'Accounts Payable',
    icon: 'ArrowUpFromLine',
    items: [
      { label: 'Vendor Management', href: '/ap/vendors', status: 'live' },
      { label: 'Purchase Invoices', href: '/ap/purchase-invoices', status: 'live' },
      { label: 'Payment Processing', href: '/ap/payments', status: 'live' },
      { label: 'Aging Reports', href: '/ap/aging', status: 'live' },
    ],
  },
  {
    label: 'Accounts Receivable',
    icon: 'ArrowDownToLine',
    items: [
      { label: 'Customer Management', href: '/ar/customers', status: 'live' },
      { label: 'Sales Invoices', href: '/ar/sales-invoices', status: 'live' },
      { label: 'Receipts', href: '/ar/receipts', status: 'live' },
      { label: 'Customer Aging', href: '/ar/aging', status: 'live' },
    ],
  },
  {
    label: 'Cash & Bank',
    icon: 'Landmark',
    items: [
      { label: 'Bank Reconciliation', href: '/cash-bank/reconciliation', status: 'live' },
      { label: 'Cash Transactions', href: '/cash-bank/transactions', status: 'live' },
      { label: 'Bank Transfers', href: '/cash-bank/transfers', status: 'live' },
    ],
  },
  {
    label: 'Financial Management',
    icon: 'PiggyBank',
    items: [
      { label: 'Fixed Assets Management', href: '/fixed-assets', status: 'live' },
      { label: 'Budgeting & Forecasting', href: '/budgeting', status: 'live' },
      { label: 'Expense Management', href: '/expenses', status: 'live' },
      { label: 'Tax Management', href: '/tax', status: 'live' },
    ],
  },
  {
    label: 'Inventory & Sales',
    icon: 'Boxes',
    items: [
      { label: 'Inventory / Stock', href: '/inventory', status: 'live' },
      { label: 'Sales Management', href: '/sales-management', status: 'live' },
      { label: 'Purchase Management', href: '/purchase-management', status: 'live' },
    ],
  },
  {
    label: 'Payroll & HR',
    icon: 'Users',
    items: [
      { label: 'Payroll Management', href: '/payroll', status: 'planned' },
      { label: 'Employee Management (HR)', href: '/hr', status: 'planned' },
    ],
  },
  {
    label: 'Reporting & Compliance',
    icon: 'FileBarChart',
    items: [
      { label: 'Financial Reporting', href: '/reports/financial-statements', status: 'live' },
      { label: 'Audit & Compliance', href: '/audit', status: 'planned' },
      { label: 'Multi-Currency Management', href: '/multi-currency', status: 'planned' },
    ],
  },
  {
    label: 'Advanced / Optional',
    icon: 'Sparkles',
    items: [
      { label: 'Project Accounting', href: '/project-accounting', status: 'planned' },
      { label: 'Cost Center Accounting', href: '/cost-centers', status: 'planned' },
      { label: 'Manufacturing / Production', href: '/manufacturing', status: 'planned' },
      { label: 'Point of Sale (POS)', href: '/pos', status: 'live' },
      { label: 'Multi-Company Management', href: '/multi-company', status: 'live' },
      { label: 'CRM Integration', href: '/crm', status: 'live' },
    ],
  },
];
