'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth';

export async function login(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error('Invalid email or password.');
    }
    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn('google', { redirectTo: '/' });
}
