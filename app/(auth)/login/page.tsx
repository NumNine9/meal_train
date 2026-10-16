'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { sendOtp, type AuthActionState } from '../actions';

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(sendOtp, initialState);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Sign in
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        We will send you a 6-digit code via SMS.
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="082 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            South African numbers only for now.
          </p>
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
          {pending ? 'Sending code…' : 'Send code'}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-6 text-center">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}