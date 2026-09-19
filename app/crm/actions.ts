'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim() || null;
  const email = String(formData.get('email') ?? '').trim() || null;
  const phone = String(formData.get('phone') ?? '').trim() || null;
  const value = Number(formData.get('value') ?? 0) || 0;
  const notes = String(formData.get('notes') ?? '').trim() || null;

  if (!name) throw new Error('Lead name is required');

  await prisma.lead.create({ data: { name, company, email, phone, value, notes } });
  revalidatePath('/crm');
}

export async function setLeadStage(id: string, stage: string) {
  await prisma.lead.update({ where: { id }, data: { stage } });
  revalidatePath('/crm');
}

export async function convertLeadToCustomer(id: string) {
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id } });

  const customer = await prisma.$transaction(async (tx) => {
    const created = await tx.customer.create({
      data: { name: lead.company || lead.name, email: lead.email, phone: lead.phone },
    });
    await tx.lead.update({ where: { id }, data: { customerId: created.id, stage: 'WON' } });
    return created;
  });

  revalidatePath('/crm');
  revalidatePath('/ar/customers');
  return customer.id;
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath('/crm');
}
