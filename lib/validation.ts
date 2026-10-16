import { z } from 'zod';

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const createTrainSchema = z
  .object({
    recipient_name: z
      .string()
      .trim()
      .min(1, 'Please enter a name or nickname')
      .max(50, 'Please keep it short'),

    delivery_address: z
      .string()
      .trim()
      .min(5, 'Please enter a full delivery address')
      .max(300, 'Address is too long'),

    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),

    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),

    meal_types: z
      .array(z.enum(MEAL_TYPES))
      .min(1, 'Choose at least one meal'),

    dietary_notes: z
      .string()
      .trim()
      .max(500, 'Keep it under 500 characters')
      .optional()
      .default(''),

    recipient_note: z
      .string()
      .trim()
      .max(500, 'Keep it under 500 characters')
      .optional()
      .default(''),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'End date must be on or after the start date',
    path: ['end_date'],
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date).getTime();
      const end = new Date(data.end_date).getTime();
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days <= 90;
    },
    {
      message: 'A meal train cannot exceed 90 days',
      path: ['end_date'],
    }
  );

export type CreateTrainInput = z.infer<typeof createTrainSchema>;