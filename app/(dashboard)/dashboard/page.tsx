import { Suspense } from 'react';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatPhone } from '@/lib/phone';
import Link from 'next/link';

// --- Async child component: all Supabase calls live here ---
async function DashboardContent() {
  await connection();   // 👈 MUST be before any Supabase call

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('users')
    .select('name, phone')
    .eq('id', user!.id)
    .maybeSingle();

  const { data: trains } = await supabase
    .from('meal_trains')
    .select('id, recipient_name, start_date, end_date, status')
    .order('created_at', { ascending: false });

  const hasTrains = trains && trains.length > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {profile?.name ? `Hello, ${profile.name}` : 'Welcome'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Signed in as {formatPhone(profile?.phone ?? '')}
        </p>
      </div>

      {!hasTrains ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🍲</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            No meal trains yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first meal train to start coordinating meals for
            someone in your community.
          </p>
          <Link
            href="/trains/new"
            className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Create a meal train
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your meal trains</h2>
            <Link
              href="/trains/new"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + New train
            </Link>
          </div>
          {trains.map((train) => (
            <Link
              key={train.id}
              href={`/trains/${train.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    For {train.recipient_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {train.start_date} → {train.end_date}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                  {train.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Synchronous page: just renders shell + Suspense ---
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12">
        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-40 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
      </div>
    </div>
  );
}