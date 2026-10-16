'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { normalizePhone } from '@/lib/phone';

export type AuthActionState = {
  error?: string;
  success?: boolean;
};

export async function sendOtp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawPhone = String(formData.get('phone') ?? '').trim();
  const phone = normalizePhone(rawPhone);

  if (!phone) {
    return { error: 'Please enter a valid South African phone number.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { channel: 'sms' },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to verify page with phone in URL
  redirect(`/verify?phone=${encodeURIComponent(phone)}`);
}

export async function verifyOtp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const phone = String(formData.get('phone') ?? '').trim();
  const token = String(formData.get('token') ?? '').trim();

  if (!phone) return { error: 'Missing phone number.' };
  if (!/^\d{6}$/.test(token)) {
    return { error: 'Please enter the 6-digit code.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    return { error: 'Invalid or expired code. Please try again.' };
  }

  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}