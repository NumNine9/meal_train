'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';

export type LogReminderState = {
  success?: boolean;
  error?: string;
};

/**
 * Record that a reminder was sent (for POPIA audit trail).
 * Does NOT send the WhatsApp message — that's a client-side wa.me link.
 */
export async function logReminder(
  _prev: LogReminderState,
  formData: FormData
): Promise<LogReminderState> {
  const slotId = String(formData.get('slotId') ?? '').trim();
  if (!slotId) return { error: 'Missing slot ID.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not signed in.' };

  // Verify organizer owns the slot's train
  const { data: slot } = await supabase
    .from('meal_slots')
    .select(
      'id, claimed_by_phone, meal_train_id, meal_trains!inner(organizer_id)'
    )
    .eq('id', slotId)
    .maybeSingle();

  if (!slot) return { error: 'Slot not found.' };

  const train = slot.meal_trains as unknown as { organizer_id: string };
  if (train.organizer_id !== user.id) {
    return { error: 'Not authorized.' };
  }

  if (!slot.claimed_by_phone) {
    return { error: 'This slot has no volunteer phone.' };
  }

  // Log via service role (bypasses notifications RLS)
  const service = createServiceClient();

  const { error } = await service.from('notifications').insert({
    recipient_phone: slot.claimed_by_phone,
    channel: 'whatsapp',
    template: 'reminder_24h',
    meal_slot_id: slot.id,
    meal_train_id: slot.meal_train_id,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to log reminder:', error);
    return { error: 'Could not log the reminder.' };
  }

  return { success: true };
}