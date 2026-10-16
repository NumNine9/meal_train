import { formatPhone } from './phone';

/**
 * Build a wa.me URL for sending a WhatsApp message.
 * Returns null if the phone number can't be parsed.
 */
export function buildWhatsAppUrl(
  phone: string,
  message: string
): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Format a date string for display in WhatsApp reminders.
 * "2026-10-21" → "Tuesday, 21 October"
 */
export function formatReminderDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

type ReminderContext = {
  volunteerName: string;
  recipientName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  deliveryAddress: string;
  dietaryNotes?: string | null;
  recipientNote?: string | null;
};

const MEAL_LABELS = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
};

/**
 * Compose the WhatsApp reminder message for a volunteer.
 */
export function composeReminderMessage(ctx: ReminderContext): string {
  const lines = [
    `Hi ${ctx.volunteerName}!`,
    '',
    `Just a friendly reminder — you're bringing ${MEAL_LABELS[ctx.mealType]} for ${ctx.recipientName} on ${formatReminderDate(ctx.date)}.`,
    '',
    `📍 ${ctx.deliveryAddress}`,
  ];

  if (ctx.dietaryNotes) {
    lines.push('', `🥗 Dietary notes: ${ctx.dietaryNotes}`);
  }
  if (ctx.recipientNote) {
    lines.push('', `📝 ${ctx.recipientNote}`);
  }

  lines.push(
    '',
    `If you can no longer make it, please let the organizer know as soon as possible so they can find a replacement.`,
    '',
    `— Sent via Meal Train SA`
  );

  return lines.join('\n');
}