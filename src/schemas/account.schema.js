import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    user_id: z.number('user id must be a number'),
    initial_deposit: z.number('initial deposit must be a number'),
  }),
});

export const getAccountByNumberSchema = z.object({
  params: z.object({
    accountNumber: z
      .string()
      .length(10, 'account number must be 10 digits')
      .pipe(z.coerce.number().int().positive('account number must not be a negative number')),
  }),
});

export const getAccountsByUserIdSchema = z.object({
  params: z.object({
    userId: z.coerce
      .number('user id must be a number')
      .int()
      .positive('user id must not be a negative number'),
  }),
});
