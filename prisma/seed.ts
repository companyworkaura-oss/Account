import { PrismaClient } from '@prisma/client';
import type { AccountType } from '../lib/types';

const prisma = new PrismaClient();

const chartOfAccounts: { code: string; name: string; type: AccountType; subType?: string }[] = [
  { code: '1000', name: 'Cash on Hand', type: 'ASSET', subType: 'Current Asset' },
  { code: '1010', name: 'Bank Account - Operating', type: 'ASSET', subType: 'Current Asset' },
  { code: '1200', name: 'Accounts Receivable', type: 'ASSET', subType: 'Current Asset' },
  { code: '1300', name: 'Inventory', type: 'ASSET', subType: 'Current Asset' },
  { code: '1500', name: 'Fixed Assets - Equipment', type: 'ASSET', subType: 'Fixed Asset' },
  { code: '1590', name: 'Accumulated Depreciation', type: 'ASSET', subType: 'Fixed Asset' },
  { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', subType: 'Current Liability' },
  { code: '2100', name: 'VAT/GST Payable', type: 'LIABILITY', subType: 'Current Liability' },
  { code: '2200', name: 'Accrued Expenses', type: 'LIABILITY', subType: 'Current Liability' },
  { code: '3000', name: "Owner's Equity", type: 'EQUITY' },
  { code: '3900', name: 'Retained Earnings', type: 'EQUITY' },
  { code: '4000', name: 'Sales Revenue', type: 'REVENUE' },
  { code: '4900', name: 'Other Income', type: 'REVENUE' },
  { code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE' },
  { code: '6000', name: 'Salaries & Wages', type: 'EXPENSE' },
  { code: '6100', name: 'Rent Expense', type: 'EXPENSE' },
  { code: '6200', name: 'Utilities Expense', type: 'EXPENSE' },
  { code: '6300', name: 'Office Supplies', type: 'EXPENSE' },
  { code: '6400', name: 'Depreciation Expense', type: 'EXPENSE' },
  { code: '6900', name: 'Miscellaneous Expense', type: 'EXPENSE' },
];

async function main() {
  console.log('Seeding company settings...');
  const existingSettings = await prisma.companySettings.findFirst();
  if (!existingSettings) {
    await prisma.companySettings.create({
      data: { name: 'My Company Pvt Ltd', currency: 'USD', fiscalYearStart: 1 },
    });
  }

  console.log('Seeding chart of accounts...');
  const accountByCode = new Map<string, string>();
  for (const acc of chartOfAccounts) {
    const created = await prisma.account.upsert({
      where: { code: acc.code },
      update: {},
      create: acc,
    });
    accountByCode.set(acc.code, created.id);
  }

  const bankCount = await prisma.bankAccount.count();
  if (bankCount === 0) {
    console.log('Seeding bank accounts...');
    await prisma.bankAccount.create({
      data: {
        name: 'Main Operating Account',
        bankName: 'First National Bank',
        accountNumber: '0123456789',
        currency: 'USD',
        openingBalance: 25000,
      },
    });
    await prisma.bankAccount.create({
      data: {
        name: 'Petty Cash',
        bankName: 'Cash Drawer',
        accountNumber: '-',
        currency: 'USD',
        openingBalance: 500,
      },
    });
  }

  const vendorCount = await prisma.vendor.count();
  let vendorIds: string[] = [];
  if (vendorCount === 0) {
    console.log('Seeding vendors...');
    const v1 = await prisma.vendor.create({ data: { name: 'Acme Office Supplies', email: 'billing@acmesupplies.com', phone: '+1-555-0101' } });
    const v2 = await prisma.vendor.create({ data: { name: 'Nova Utilities Co.', email: 'accounts@novautil.com', phone: '+1-555-0102' } });
    vendorIds = [v1.id, v2.id];
  } else {
    vendorIds = (await prisma.vendor.findMany({ select: { id: true } })).map((v) => v.id);
  }

  const customerCount = await prisma.customer.count();
  let customerIds: string[] = [];
  if (customerCount === 0) {
    console.log('Seeding customers...');
    const c1 = await prisma.customer.create({ data: { name: 'Blue Horizon LLC', email: 'ap@bluehorizon.com', phone: '+1-555-0201' } });
    const c2 = await prisma.customer.create({ data: { name: 'Summit Retailers', email: 'finance@summitretail.com', phone: '+1-555-0202' } });
    customerIds = [c1.id, c2.id];
  } else {
    customerIds = (await prisma.customer.findMany({ select: { id: true } })).map((c) => c.id);
  }

  const jeCount = await prisma.journalEntry.count();
  if (jeCount === 0) {
    console.log('Seeding opening journal entry...');
    await prisma.journalEntry.create({
      data: {
        entryNumber: 'JE-0001',
        date: new Date(),
        memo: 'Opening balances',
        status: 'POSTED',
        lines: {
          create: [
            { accountId: accountByCode.get('1010')!, debit: 25000, credit: 0, description: 'Opening bank balance' },
            { accountId: accountByCode.get('1000')!, debit: 500, credit: 0, description: 'Opening petty cash' },
            { accountId: accountByCode.get('3000')!, debit: 0, credit: 25500, description: "Owner's equity opening" },
          ],
        },
      },
    });
  }

  const piCount = await prisma.purchaseInvoice.count();
  if (piCount === 0 && vendorIds.length) {
    console.log('Seeding purchase invoice...');
    await prisma.purchaseInvoice.create({
      data: {
        invoiceNumber: 'PINV-0001',
        vendorId: vendorIds[0],
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'UNPAID',
        subtotal: 450,
        tax: 45,
        total: 495,
        lines: {
          create: [{ description: 'Office supplies - Q1', quantity: 1, unitPrice: 450, amount: 450 }],
        },
      },
    });
  }

  const siCount = await prisma.salesInvoice.count();
  if (siCount === 0 && customerIds.length) {
    console.log('Seeding sales invoice...');
    await prisma.salesInvoice.create({
      data: {
        invoiceNumber: 'SINV-0001',
        customerId: customerIds[0],
        date: new Date(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'UNPAID',
        subtotal: 2000,
        tax: 200,
        total: 2200,
        lines: {
          create: [{ description: 'Consulting services - March', quantity: 1, unitPrice: 2000, amount: 2000 }],
        },
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
