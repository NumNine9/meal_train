'use client';

import { createEvent, type DateArray } from 'ics';

export function AddToCalendar({
  slotId,
  mealType,
  recipientName,
  deliveryAddress,
  date,
}: {
  slotId: string;
  mealType: string;
  recipientName: string;
  deliveryAddress: string;
  date: string; // YYYY-MM-DD
}) {
  function handleClick() {
    const [year, month, day] = date.split('-').map(Number);

    const start: DateArray = [year, month, day, 17, 0]; // 5pm SAST

    const { error, value } = createEvent({
      title: `Meal for ${recipientName}`,
      description: `${mealType} delivery for ${recipientName}'s meal train.`,
      location: deliveryAddress,
      start,
      duration: { hours: 2 },
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      uid: `mealtrain-${slotId}@mealtrainsa`,
    });

    if (error || !value) {
      alert('Could not create the calendar file.');
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-train-${date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
    >
      📅 Add to my calendar
    </button>
  );
}