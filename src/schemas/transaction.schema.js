import { z } from 'zod';

export const depositSchema = z.object({
  body: z.object({
    account_number: z
      .string('account number must written in string form')
      .length(10, 'account number must be 10 digits')
      .pipe(z.coerce.number().int().positive()),

    amount: z.coerce
      .number('amount must be a number')
      .positive('amount must not be a negative number'),
  }),
});

export const withdrawSchema = z.object({
  body: z.object({
    account_number: z
      .string('account number must written in string form')
      .length(10, 'account number must be 10 digits')
      .pipe(z.coerce.number().int().positive()),

    amount: z.coerce
      .number('amount must be a number')
      .positive('amount must not be a negative number'),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    sender_account_number: z
      .string('account number must written in string form')
      .length(10, 'account number must be 10 digits')
      .pipe(z.coerce.number().int().positive()),

    receiver_account_number: z
      .string('account number must written in string form')
      .length(10, 'account number must be 10 digits')
      .pipe(z.coerce.number().int().positive()),

    amount: z.coerce
      .number('amount must be a number in string form')
      .positive('amount must not be a negative number'),
  }),
});

export const getStatementSchema = z.object({
  params: z.object({
    accountNumber: z
      .string('account number must written in string form')
      .length(10, 'account number must be 10 digits')
      .pipe(z.coerce.number().int().positive()),
  }),
});
