import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/format';
import { NewUserButton, DeleteUserButton } from './UserDialog';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const [users, session] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
    auth(),
  ]);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  return (
    <div>
      <PageHeader
        title="Users"
        description="People who can sign in to this workspace. There's no open sign-up — only you can create logins here."
        actions={<NewUserButton />}
      />

      <div className="glass-panel overflow-hidden">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Added</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium text-white">{u.name ?? '—'}{u.id === currentUserId && <span className="ml-2 badge border border-accent-500/30 text-accent-300">You</span>}</td>
                <td className="text-white/60">{u.email}</td>
                <td className="text-white/50">{formatDate(u.createdAt)}</td>
                <td>
                  <div className="flex justify-end">
                    {u.id !== currentUserId && <DeleteUserButton id={u.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
