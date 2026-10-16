import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound, redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { format, parseISO } from 'date-fns';
import { ClaimForm } from './ClaimForm';
import Link from 'next/link';

type Params = Promise<{ token: string; slotId: string }>;

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

async function ClaimView({ params }: { params: Params }) {
  await connection();
  const { token, slotId } = await params;

  const supabase = createServiceClient();

  const { data: train } = await supabase
    .from('meal_trains')
    .select('id, recipient_name, delivery_address, status')
    .eq('share_token', token)
    .maybeSingle();

  if (!train) notFound();

  const { data: slot } = await supabase
    .from('meal_slots')
    .select('id, date, meal_type, status')
    .eq('id', slotId)
    .eq('meal_train_id', train.id)
    .maybeSingle();

  if (!slot) notFound();

  // Redirect if slot already claimed
  if (slot.status !== 'open') {
    redirect(`/t/${token}`);
  }

  // Redirect if train is closed
  if (train.status !== 'active') {
    redirect(`/t/${token}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/t/${token}`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to calendar
          </Link>
        </div>

        {/* Slot summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            You are claiming
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {MEAL_LABELS[slot.meal_type]} for {train.recipient_name}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {format(parseISO(slot.date), 'EEEE, d MMMM yyyy')}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            📍 {train.delivery_address}
          </p>
        </div>

        <ClaimForm
          token={token}
          slotId={slot.id}
        />
      </div>
    </div>
  );
}

export default function ClaimPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ClaimSkeleton />}>
      <ClaimView params={params} />
    </Suspense>
  );
}

function ClaimSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="h-40 bg-white border border-gray-200 rounded-xl mb-6"></div>
        <div className="space-y-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-20 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}