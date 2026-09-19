'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function readCustomerForm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    address: String(formData.get('address') ?? '').trim() || null,
    taxId: String(formData.get('taxId') ?? '').trim() || null,
  };
}

export async function createCustomer(formData: FormData) {
  const data = readCustomerForm(formData);
  if (!data.name) throw new Error('Customer name is required');
  await prisma.customer.create({ data });
  revalidatePath('/ar/customers');
}

export async function updateCustomer(id: string, formData: FormData) {
  const data = readCustomerForm(formData);
  const isActive = formData.get('isActive') === 'on';
  await prisma.customer.update({ where: { id }, data: { ...data, isActive } });
  revalidatePath('/ar/customers');
}

export async function deleteCustomer(id: string) {
  const invoiceCount = await prisma.salesInvoice.count({ where: { customerId: id } });
  if (invoiceCount > 0) throw new Error('Cannot delete a customer with existing invoices.');
  await prisma.customer.delete({ where: { id } });
  revalidatePath('/ar/customers');
}
