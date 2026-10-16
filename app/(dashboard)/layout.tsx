import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SignOutButton } from './sign-out-button';
import { Greeting } from '../../components/Greetings';
import { connection } from 'next/server';
import { InstallPrompt } from '@/components/InstallPrompt';

export const instant = false;
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection()
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensive — proxy should already have redirected
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍲</span>
            <span className="font-semibold text-gray-900">
              Meal Train SA
            </span>
          </div>
          <Greeting />
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      <InstallPrompt />
    </div>
  );
}