import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { VolunteerCalendar } from './VolunteerCalendar';

type Params = Promise<{ token: string }>;

async function TrainView({ params }: { params: Params }) {
  await connection();
  const { token } = await params;

  const supabase = createServiceClient();

  const { data: train } = await supabase
    .from('meal_trains')
    .select(
      'id, recipient_name, recipient_note, delivery_address, dietary_notes, start_date, end_date, status'
    )
    .eq('share_token', token)
    .maybeSingle();

  if (!train) notFound();

  const { data: slots } = await supabase
    .from('meal_slots')
    .select('id, date, meal_type, status, claimed_by_name, volunteer_note')
    .eq('meal_train_id', train.id)
    .order('date', { ascending: true })
    .order('meal_type', { ascending: true });

  const totalSlots = slots?.length ?? 0;
  const claimedSlots = slots?.filter((s) => s.status !== 'open').length ?? 0;

  const isInactive = train.status !== 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🍲</div>
          <h1 className="text-2xl font-bold text-gray-900">
            A meal train for {train.recipient_name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {claimedSlots} of {totalSlots} slots claimed
          </p>
        </div>

        {isInactive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
            This meal train has been {train.status}. You can still view
            the details, but new claims are closed.
          </div>
        )}

        {/* Details card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
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

        {/* Calendar */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Pick a slot
          </h2>
          <VolunteerCalendar
            token={token}
            slots={slots ?? []}
            disabled={isInactive}
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Meal Train SA · No login required
        </p>
      </div>
    </div>
  );
}

export default function PublicTrainPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<PublicSkeleton />}>
      <TrainView params={params} />
    </Suspense>
  );
}

function PublicSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-8"></div>
        <div className="h-40 bg-white border border-gray-200 rounded-xl mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}