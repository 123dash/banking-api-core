import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    full_name: z.string().min(1, 'full name must not be empty'),
    email: z.email('Please enter a valid email address'),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.coerce
      .number('user id must be a number')
      .int()
      .positive('user id must not be a negative number'),
  }),
});
