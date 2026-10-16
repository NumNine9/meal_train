'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { verifyOtp, type AuthActionState } from '../actions';
import { formatPhone } from '@/lib/phone';

const initialState: AuthActionState = {};

function VerifyForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') ?? '';

  const [state, formAction, pending] = useActionState(verifyOtp, initialState);

  if (!phone) {
    return (
      <div>
        <p className="text-sm text-red-600 mb-4">
          Missing phone number. Please start over.
        </p>
        <Link
          href="/login"
          className="block text-center text-blue-600 underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Enter your code
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        We sent a 6-digit code to{' '}
        <span className="font-medium text-gray-700">
          {formatPhone(phone)}
        </span>
        .
      </p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="phone" value={phone} />

        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Code
          </label>
          <input
            id="token"
            name="token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            placeholder="123456"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {state.error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {pending ? 'Verifying…' : 'Verify and continue'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Wrong number?{' '}
        <Link href="/login" className="text-blue-600 underline">
          Start over
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
      <VerifyForm />
    </Suspense>
  );
}