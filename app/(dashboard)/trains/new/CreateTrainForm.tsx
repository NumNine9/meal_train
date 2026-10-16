'use client';

import { useActionState, useState } from 'react';
import { createTrain, type CreateTrainState } from './actions';
import { MEAL_TYPES, type MealType } from '@/lib/validation';


type CreateTrainFormProps = {
  today: string;
  maxDate: string;
};

const initialState: CreateTrainState = {};

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

export function CreateTrainForm({ today, maxDate }: CreateTrainFormProps) {
  const [state, formAction, pending] = useActionState(createTrain, initialState);
  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(['dinner']);

  function toggleMeal(meal: MealType) {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {/* Recipient name */}
      <div>
        <label
          htmlFor="recipient_name"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Who are we supporting?
        </label>
        <p className="text-xs text-gray-500 mb-2">
          A first name or nickname is enough. Volunteers will see this.
        </p>
        <input
          id="recipient_name"
          name="recipient_name"
          type="text"
          required
          maxLength={50}
          placeholder="e.g. Thandi"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {state.fieldErrors?.recipient_name && (
          <p className="text-xs text-red-600 mt-1">
            {state.fieldErrors.recipient_name[0]}
          </p>
        )}
      </div>

      {/* Delivery address */}
      <div>
        <label
          htmlFor="delivery_address"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Delivery address
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Where should volunteers drop off the meals?
        </p>
        <textarea
          id="delivery_address"
          name="delivery_address"
          required
          rows={2}
          maxLength={300}
          placeholder="e.g. 14 Acacia Street, Rosebank, Cape Town"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
        {state.fieldErrors?.delivery_address && (
          <p className="text-xs text-red-600 mt-1">
            {state.fieldErrors.delivery_address[0]}
          </p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Start date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            min={today}
            max={maxDate}
            defaultValue={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            End date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            required
            min={today}
            max={maxDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
      {state.fieldErrors?.end_date && (
        <p className="text-xs text-red-600 -mt-4">
          {state.fieldErrors.end_date[0]}
        </p>
      )}

      {/* Meal types */}
      <div>
        <span className="block text-sm font-medium text-gray-900 mb-1">
          Which meals are needed?
        </span>
        <p className="text-xs text-gray-500 mb-3">
          Pick one or more. We will create a slot for each.
        </p>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((meal) => {
            const checked = selectedMeals.includes(meal);
            return (
              <button
                key={meal}
                type="button"
                onClick={() => toggleMeal(meal)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  checked
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {MEAL_LABELS[meal]}
              </button>
            );
          })}
        </div>
        {/* Hidden inputs to submit selected values */}
        {selectedMeals.map((meal) => (
          <input key={meal} type="hidden" name="meal_types" value={meal} />
        ))}
        {state.fieldErrors?.meal_types && (
          <p className="text-xs text-red-600 mt-2">
            {state.fieldErrors.meal_types[0]}
          </p>
        )}
      </div>

      {/* Dietary notes */}
      <div>
        <label
          htmlFor="dietary_notes"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Dietary notes{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Allergies, preferences, or things to avoid. Volunteers will see
          this.
        </p>
        <textarea
          id="dietary_notes"
          name="dietary_notes"
          rows={2}
          maxLength={500}
          placeholder="e.g. No pork. Easy-to-reheat meals preferred."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      {/* Private note */}
      <div>
        <label
          htmlFor="recipient_note"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Note for volunteers{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Logistics, drop-off windows, anything helpful.
        </p>
        <textarea
          id="recipient_note"
          name="recipient_note"
          rows={3}
          maxLength={500}
          placeholder="e.g. Ring the bell, don't knock loudly — baby is sleeping. Drop off between 4–6pm."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      {/* Global error */}
      {state.error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {state.error}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || selectedMeals.length === 0}
          className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {pending ? 'Creating…' : 'Create meal train'}
        </button>
      </div>
    </form>
  );
}