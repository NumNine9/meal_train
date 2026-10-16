import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShareLink } from './ShareLink';
import { SlotCalendar } from './SlotCalendar';
import Link from 'next/link';

type Params = Promise<{ id: string }>;

// Async child receives the params PROMISE — not the resolved value.
async function TrainContent({ params }: { params: Params }) {
  await connection();          // gate first
  const { id } = await params; // 👈 await inside the suspended child

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: train } = await supabase
    .from('meal_trains')
    .select('*')
    .eq('id', id)
    .eq('organizer_id', user.id)
    .maybeSingle();

  if (!train) notFound();

  const { data: slots } = await supabase
    .from('meal_slots')
    .select('*')
    .eq('meal_train_id', id)
    .order('date', { ascending: true })
    .order('meal_type', { ascending: true });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const shareUrl = `${appUrl}/t/${train.share_token}`;

  const totalSlots = slots?.length ?? 0;
  const claimedSlots = slots?.filter((s) => s.status !== 'open').length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          For {train.recipient_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {train.start_date} → {train.end_date} · {totalSlots} slots ·{' '}
          {claimedSlots} claimed
        </p>
      </div>

      <ShareLink url={shareUrl} />

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Details
        </h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500">Delivery address</dt>
            <dd className="text-gray-900 mt-0.5">
              {train.delivery_address}
            </dd>
          </div>
          {train.dietary_notes && (
            <div>
              <dt className="text-gray-500">Dietary notes</dt>
              <dd className="text-gray-900 mt-0.5">
                {train.dietary_notes}
              </dd>
            </div>
          )}
          {train.recipient_note && (
            <div>
              <dt className="text-gray-500">Note for volunteers</dt>
              <dd className="text-gray-900 mt-0.5">
                {train.recipient_note}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Calendar
        </h2>
        <SlotCalendar slots={slots ?? []} />
      </div>
    </div>
  );
}

// Sync page — NO await params here. Pass the promise straight through.
export default function TrainPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-100 rounded-xl mt-8"></div>
          <div className="h-64 bg-gray-100 rounded-xl mt-8"></div>
        </div>
      }
    >
      <TrainContent params={params} />
    </Suspense>
  );
}