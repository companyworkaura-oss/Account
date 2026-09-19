export function effectiveStatus(status: string, dueDate: Date | string, amountPaid: number, total: number): string {
  if (status === 'PAID') return 'PAID';
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  if (due.getTime() < Date.now() && amountPaid < total - 0.01) return 'OVERDUE';
  return status;
}

export function agingBucket(dueDate: Date | string): '0-30' | '31-60' | '61-90' | '90+' {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const daysPastDue = Math.floor((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24));
  if (daysPastDue <= 30) return '0-30';
  if (daysPastDue <= 60) return '31-60';
  if (daysPastDue <= 90) return '61-90';
  return '90+';
}
