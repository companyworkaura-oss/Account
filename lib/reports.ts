import { prisma } from '@/lib/prisma';

export async function getCashPosition() {
  const accounts = await prisma.bankAccount.findMany({ include: { transactions: true } });
  let total = 0;
  for (const acc of accounts) {
    let balance = acc.openingBalance;
    for (const t of acc.transactions) {
      if (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN') balance += t.amount;
      else balance -= t.amount;
    }
    total += balance;
  }
  return { total, accounts };
}

export async function getBankAccountBalance(bankAccountId: string) {
  const acc = await prisma.bankAccount.findUnique({
    where: { id: bankAccountId },
    include: { transactions: true },
  });
  if (!acc) return 0;
  let balance = acc.openingBalance;
  for (const t of acc.transactions) {
    if (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN') balance += t.amount;
    else balance -= t.amount;
  }
  return balance;
}

export async function getAROutstanding() {
  const invoices = await prisma.salesInvoice.findMany({ where: { status: { not: 'PAID' } } });
  return invoices.reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
}

export async function getAPOutstanding() {
  const invoices = await prisma.purchaseInvoice.findMany({ where: { status: { not: 'PAID' } } });
  return invoices.reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
}

export async function getTrialBalance() {
  const accounts = await prisma.account.findMany({
    include: { lines: true },
    orderBy: { code: 'asc' },
  });

  return accounts.map((acc) => {
    const debit = acc.lines.reduce((s, l) => s + l.debit, 0);
    const credit = acc.lines.reduce((s, l) => s + l.credit, 0);
    const net = debit - credit;
    const isDebitNormal = acc.type === 'ASSET' || acc.type === 'EXPENSE';
    return {
      id: acc.id,
      code: acc.code,
      name: acc.name,
      type: acc.type,
      debitTotal: debit,
      creditTotal: credit,
      debitBalance: isDebitNormal && net > 0 ? net : isDebitNormal ? 0 : net < 0 ? -net : 0,
      creditBalance: !isDebitNormal && net < 0 ? -net : !isDebitNormal ? 0 : net > 0 ? net : 0,
      balance: isDebitNormal ? net : -net,
    };
  });
}

export async function getIncomeStatement() {
  const trialBalance = await getTrialBalance();
  const revenue = trialBalance.filter((a) => a.type === 'REVENUE');
  const expense = trialBalance.filter((a) => a.type === 'EXPENSE');
  const totalRevenue = revenue.reduce((s, a) => s + a.balance, 0);
  const totalExpense = expense.reduce((s, a) => s + a.balance, 0);
  return {
    revenue,
    expense,
    totalRevenue,
    totalExpense,
    netIncome: totalRevenue - totalExpense,
  };
}

export async function getBalanceSheet() {
  const trialBalance = await getTrialBalance();
  const assets = trialBalance.filter((a) => a.type === 'ASSET');
  const liabilities = trialBalance.filter((a) => a.type === 'LIABILITY');
  const equity = trialBalance.filter((a) => a.type === 'EQUITY');
  const { netIncome } = await getIncomeStatement();

  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const totalEquity = equity.reduce((s, a) => s + a.balance, 0) + netIncome;

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    netIncome,
    balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
  };
}

export async function getCashFlowStatement() {
  const transactions = await prisma.cashTransaction.findMany({ orderBy: { date: 'asc' } });
  const inflow = transactions
    .filter((t) => t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN')
    .reduce((s, t) => s + t.amount, 0);
  const outflow = transactions
    .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER_OUT')
    .reduce((s, t) => s + t.amount, 0);

  const byMonth = new Map<string, { month: string; inflow: number; outflow: number }>();
  for (const t of transactions) {
    const key = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!byMonth.has(key)) byMonth.set(key, { month: key, inflow: 0, outflow: 0 });
    const bucket = byMonth.get(key)!;
    if (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN') bucket.inflow += t.amount;
    else bucket.outflow += t.amount;
  }

  return {
    inflow,
    outflow,
    net: inflow - outflow,
    monthly: Array.from(byMonth.values()),
  };
}
