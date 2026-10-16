'use client';

import { useActionState } from 'react';
import { claimSlot, type ClaimState } from '../../actions';

const initialState: ClaimState = {};

export function ClaimForm({
  token,
  slotId,
}: {
  token: string;
  slotId: string;
}) {
  const [state, formAction, pending] = useActionState(claimSlot, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="slotId" value={slotId} />

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={60}
            autoComplete="name"
            placeholder="e.g. Priya"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            The organizer will see this.
          </p>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Your phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder="082 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Only used to send you a reminder the day before.
          </p>
        </div>

        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            What will you bring?{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="note"
            name="note"
            type="text"
            maxLength={300}
            placeholder="e.g. Vegetable curry and rice"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {state.error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {pending ? 'Claiming…' : 'Claim this slot'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        You can cancel any time by replying to your reminder.
      </p>
    </form>
  );
}