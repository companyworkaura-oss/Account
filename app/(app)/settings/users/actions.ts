'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email) throw new Error('Email is required.');
  if (password.length < 8) throw new Error('Password must be at least 8 characters.');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('A user with this email already exists.');

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name: name || null, email, passwordHash } });

  revalidatePath('/settings/users');
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (session?.user && (session.user as { id?: string }).id === id) {
    throw new Error('You cannot delete your own account while signed in as it.');
  }

  const remaining = await prisma.user.count();
  if (remaining <= 1) throw new Error('Cannot delete the last remaining user.');

  await prisma.user.delete({ where: { id } });
  revalidatePath('/settings/users');
}
