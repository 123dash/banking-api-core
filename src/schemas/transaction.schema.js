import { z } from 'zod';

export const depositSchema = z.object({
  body: z.object({
    account_number: z.string().length(10).pipe(z.coerce.number().int().positive()),
    amount: z.coerce.number().positive(),
  }),
});

export const withdrawSchema = z.object({
  body: z.object({
    account_number: z.string().length(10).pipe(z.coerce.number().int().positive()),
    amount: z.coerce.number().positive(),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    sender_account_number: z.string().length(10).pipe(z.coerce.number().int().positive()),
    receiver_account_number: z.string().length(10).pipe(z.coerce.number().int().positive()),
    amount: z.coerce.number().positive(),
  }),
});

export const getStatementSchema = z.object({
  params: z.object({
    accountNumber: z.string().length(10).pipe(z.coerce.number().int().positive()),
  }),
});
