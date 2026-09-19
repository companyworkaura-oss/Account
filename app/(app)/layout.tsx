import { auth } from '@/lib/auth';
import { AppShell } from '@/components/AppShell';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return <AppShell user={session?.user}>{children}</AppShell>;
}
