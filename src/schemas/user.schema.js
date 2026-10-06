import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    full_name: z.string().min(1),
    email: z.email(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
