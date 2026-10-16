import { eachDayOfInterval, format } from 'date-fns';
import type { MealType } from './validation';

export type GeneratedSlot = {
  date: string;
  meal_type: MealType;
  slot_type: 'meal';
};

/**
 * Generate all slots for a train: one per meal type, per day, inclusive.
 * Dates are formatted as YYYY-MM-DD.
 */
export function generateSlots(
  startDate: string,
  endDate: string,
  mealTypes: MealType[]
): GeneratedSlot[] {
  const days = eachDayOfInterval({
    start: new Date(startDate + 'T00:00:00'),
    end: new Date(endDate + 'T00:00:00'),
  });

  return days.flatMap((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return mealTypes.map((mealType) => ({
      date: dateStr,
      meal_type: mealType,
      slot_type: 'meal' as const,
    }));
  });
}