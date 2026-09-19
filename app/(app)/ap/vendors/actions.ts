'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function readVendorForm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    address: String(formData.get('address') ?? '').trim() || null,
    taxId: String(formData.get('taxId') ?? '').trim() || null,
  };
}

export async function createVendor(formData: FormData) {
  const data = readVendorForm(formData);
  if (!data.name) throw new Error('Vendor name is required');
  await prisma.vendor.create({ data });
  revalidatePath('/ap/vendors');
}

export async function updateVendor(id: string, formData: FormData) {
  const data = readVendorForm(formData);
  const isActive = formData.get('isActive') === 'on';
  await prisma.vendor.update({ where: { id }, data: { ...data, isActive } });
  revalidatePath('/ap/vendors');
}

export async function deleteVendor(id: string) {
  const invoiceCount = await prisma.purchaseInvoice.count({ where: { vendorId: id } });
  if (invoiceCount > 0) throw new Error('Cannot delete a vendor with existing invoices.');
  await prisma.vendor.delete({ where: { id } });
  revalidatePath('/ap/vendors');
}
