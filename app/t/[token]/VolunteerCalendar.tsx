import { format, parseISO } from 'date-fns';
import Link from 'next/link';

type Slot = {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  status: 'open' | 'claimed' | 'delivered' | 'cancelled';
  claimed_by_name: string | null;
  volunteer_note: string | null;
};

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

function groupByDate(slots: Slot[]) {
  return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});
}

export function VolunteerCalendar({
  token,
  slots,
  disabled,
}: {
  token: string;
  slots: Slot[];
  disabled: boolean;
}) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-gray-500">No slots available.</p>
    );
  }

  const grouped = groupByDate(slots);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, daySlots]) => (
        <div key={date}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {format(parseISO(date), 'EEEE, d MMMM')}
          </div>
          <div className="space-y-2">
            {daySlots.map((slot) => {
              const isOpen = slot.status === 'open' && !disabled;

              const inner = (
                <div
                  className={`border rounded-lg p-4 transition ${
                    slot.status === 'open'
                      ? disabled
                        ? 'bg-white border-gray-200 opacity-60'
                        : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-sm cursor-pointer'
                      : slot.status === 'claimed'
                        ? 'bg-green-50 border-green-200'
                        : slot.status === 'delivered'
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-red-50 border-red-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {MEAL_LABELS[slot.meal_type]}
                      </p>
                      {slot.claimed_by_name && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Claimed by {slot.claimed_by_name}
                        </p>
                      )}
                      {slot.volunteer_note && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {slot.volunteer_note}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 ml-3">
                      {slot.status === 'open' && !disabled && (
                        <span className="text-xs font-medium text-blue-600">
                          Claim →
                        </span>
                      )}
                      {slot.status === 'open' && disabled && (
                        <span className="text-xs text-gray-400">
                          Closed
                        </span>
                      )}
                      {slot.status === 'claimed' && (
                        <span className="text-xs font-medium text-green-700">
                          ✓ Taken
                        </span>
                      )}
                      {slot.status === 'delivered' && (
                        <span className="text-xs font-medium text-gray-600">
                          ✓ Delivered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return isOpen ? (
                <Link
                  key={slot.id}
                  href={`/t/${token}/claim/${slot.id}`}
                  className="block"
                >
                  {inner}
                </Link>
              ) : (
                <div key={slot.id}>{inner}</div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}