import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { AddToCalendar } from './AddToCalendar';

type Params = Promise<{ token: string; slotId: string }>;

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

async function SuccessView({ params }: { params: Params }) {
  await connection();
  const { token, slotId } = await params;

  const supabase = createServiceClient();

  const { data: train } = await supabase
    .from('meal_trains')
    .select('id, recipient_name, delivery_address, dietary_notes, recipient_note')
    .eq('share_token', token)
    .maybeSingle();

  if (!train) notFound();

  const { data: slot } = await supabase
    .from('meal_slots')
    .select('id, date, meal_type, claimed_by_name, status')
    .eq('id', slotId)
    .eq('meal_train_id', train.id)
    .maybeSingle();

  if (!slot) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">
            You are on the schedule
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thank you, {slot.claimed_by_name}.
          </p>
        </div>

        {/* What you claimed */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Your slot
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {MEAL_LABELS[slot.meal_type]} for {train.recipient_name}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {format(parseISO(slot.date), 'EEEE, d MMMM yyyy')}
          </p>
        </div>

        {/* Delivery details */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Delivery details
          </p>
          <p className="text-sm text-gray-900">{train.delivery_address}</p>

          {train.dietary_notes && (
            <p className="text-xs text-gray-500 mt-3">
              <span className="font-medium">Dietary:</span>{' '}
              {train.dietary_notes}
            </p>
          )}
          {train.recipient_note && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Note:</span>{' '}
              {train.recipient_note}
            </p>
          )}
        </div>

        <AddToCalendar
          slotId={slot.id}
          mealType={MEAL_LABELS[slot.meal_type]}
          recipientName={train.recipient_name}
          deliveryAddress={train.delivery_address}
          date={slot.date}
        />

        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-gray-400">
            📸 Screenshot this page for reference.
          </p>
          <Link
            href={`/t/${token}`}
            className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Claim another slot →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessView params={params} />
    </Suspense>
  );
}

function SuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8 animate-pulse">
        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
        <div className="h-24 bg-white border border-gray-200 rounded-xl mb-4"></div>
        <div className="h-32 bg-white border border-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}