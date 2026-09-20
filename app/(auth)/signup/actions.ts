'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';

export async function signup(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!email || !password) throw new Error('Email and password are required.');
  if (password.length < 8) throw new Error('Password must be at least 8 characters.');
  if (password !== confirmPassword) throw new Error('Passwords do not match.');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name: name || null, email, passwordHash } });

  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error('Account created, but sign-in failed. Try signing in manually.');
    }
    throw error;
  }
}
