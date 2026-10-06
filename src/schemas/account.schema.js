import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    user_id: z.number(),
    initial_deposit: z.number(),
  }),
});

export const getAccountByNumberSchema = z.object({
  params: z.object({
    accountNumber: z.string().length(10).pipe(z.coerce.number().int().positive()),
  }),
});

export const getAccountsByUserIdSchema = z.object({
  params: z.object({
    userId: z.coerce.number().int().positive(),
  }),
});
