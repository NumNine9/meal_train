'use server';

import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { normalizePhone } from '@/lib/phone';

export type ClaimState = {
  error?: string;
};

export async function claimSlot(
  _prev: ClaimState,
  formData: FormData
): Promise<ClaimState> {
  const token = String(formData.get('token') ?? '').trim();
  const slotId = String(formData.get('slotId') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const rawPhone = String(formData.get('phone') ?? '').trim();
  const note = String(formData.get('note') ?? '').trim();

  // --- Validate inputs ---
  if (!token || !slotId) {
    return { error: 'Missing required information.' };
  }
  if (name.length < 2 || name.length > 60) {
    return { error: 'Please enter your name (2–60 characters).' };
  }
  const phone = normalizePhone(rawPhone);
  if (!phone) {
    return { error: 'Please enter a valid phone number.' };
  }
  if (note.length > 300) {
    return { error: 'Note is too long (max 300 characters).' };
  }

  const supabase = createServiceClient();

  // --- Find the train by token (must be active) ---
  const { data: train, error: trainError } = await supabase
    .from('meal_trains')
    .select('id, status')
    .eq('share_token', token)
    .eq('status', 'active')
    .maybeSingle();

  if (trainError || !train) {
    return { error: 'This meal train is no longer available.' };
  }

  // --- Atomically claim the slot ---
  // The `status = 'open'` filter is the race-condition guard:
  // if two people tap "claim" at the same moment, only one UPDATE
  // matches. The other sees 0 rows updated.
  const { data: updated, error: updateError } = await supabase
    .from('meal_slots')
    .update({
      claimed_by_name: name,
      claimed_by_phone: phone,
      volunteer_note: note || null,
      claimed_at: new Date().toISOString(),
      status: 'claimed',
    })
    .eq('id', slotId)
    .eq('meal_train_id', train.id)
    .eq('status', 'open')
    .select('id')
    .maybeSingle();

  if (updateError) {
    console.error('Claim failed:', updateError);
    return { error: 'Something went wrong. Please try again.' };
  }

  if (!updated) {
    return {
      error:
        'Sorry — this slot was just claimed by someone else. Please pick another.',
    };
  }

  // --- Success: redirect to confirmation ---
  redirect(`/t/${token}/success/${slotId}`);
}