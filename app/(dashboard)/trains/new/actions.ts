'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createTrainSchema, MEAL_TYPES } from '@/lib/validation';
import { generateShareToken } from '@/lib/token';
import { generateSlots } from '@/lib/slots';

export type CreateTrainState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createTrain(
  _prev: CreateTrainState,
  formData: FormData
): Promise<CreateTrainState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  // Extract and normalise meal types from FormData
  const mealTypesRaw = formData
    .getAll('meal_types')
    .map((v) => String(v))
    .filter((v): v is (typeof MEAL_TYPES)[number] =>
      MEAL_TYPES.includes(v as (typeof MEAL_TYPES)[number])
    );

  const raw = {
    recipient_name: formData.get('recipient_name') ?? '',
    delivery_address: formData.get('delivery_address') ?? '',
    start_date: formData.get('start_date') ?? '',
    end_date: formData.get('end_date') ?? '',
    meal_types: mealTypesRaw,
    dietary_notes: formData.get('dietary_notes') ?? '',
    recipient_note: formData.get('recipient_note') ?? '',
  };

  const parsed = createTrainSchema.safeParse(raw);

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      error: 'Please fix the errors below.',
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  const shareToken = generateShareToken();

  // 1. Insert the meal train
  const { data: train, error: trainError } = await supabase
    .from('meal_trains')
    .insert({
      organizer_id: user.id,
      recipient_name: data.recipient_name,
      recipient_note: data.recipient_note || null,
      delivery_address: data.delivery_address,
      dietary_notes: data.dietary_notes || null,
      start_date: data.start_date,
      end_date: data.end_date,
      share_token: shareToken,
      status: 'active',
    })
    .select('id')
    .single();

  if (trainError || !train) {
    console.error('Failed to create meal train:', trainError);
    return { error: 'Could not create the meal train. Please try again.' };
  }

  // 2. Generate and insert the slots
  const slots = generateSlots(data.start_date, data.end_date, data.meal_types);

  const { error: slotsError } = await supabase.from('meal_slots').insert(
    slots.map((s) => ({
      ...s,
      meal_train_id: train.id,
      status: 'open' as const,
    }))
  );

  if (slotsError) {
    // Rollback the train if slot creation fails
    await supabase.from('meal_trains').delete().eq('id', train.id);
    console.error('Failed to create slots:', slotsError);
    return { error: 'Could not generate the calendar. Please try again.' };
  }

  revalidatePath('/dashboard');
  redirect(`/trains/${train.id}`);
}