import { format, parseISO } from 'date-fns';

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

const STATUS_STYLES = {
  open: 'bg-white border-gray-200',
  claimed: 'bg-green-50 border-green-200',
  delivered: 'bg-gray-50 border-gray-200',
  cancelled: 'bg-red-50 border-red-200 opacity-60',
};

// Group slots by date
function groupByDate(slots: Slot[]) {
  return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});
}

export function SlotCalendar({ slots }: { slots: Slot[] }) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-gray-500">No slots to display.</p>
    );
  }

  const grouped = groupByDate(slots);

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([date, daySlots]) => (
        <div key={date}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {format(parseISO(date), 'EEE, d MMM yyyy')}
          </div>
          <div className="space-y-2">
            {daySlots.map((slot) => (
              <div
                key={slot.id}
                className={`border rounded-lg p-3 ${STATUS_STYLES[slot.status]}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900 text-sm">
                      {MEAL_LABELS[slot.meal_type]}
                    </span>
                    {slot.claimed_by_name && (
                      <span className="text-sm text-gray-600 ml-2">
                        — {slot.claimed_by_name}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      slot.status === 'open'
                        ? 'bg-gray-100 text-gray-600'
                        : slot.status === 'claimed'
                          ? 'bg-green-100 text-green-700'
                          : slot.status === 'delivered'
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
                {slot.volunteer_note && (
                  <p className="text-xs text-gray-500 mt-1">
                    {slot.volunteer_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}