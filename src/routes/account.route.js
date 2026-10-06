import express from 'express';

import {
  createAccount,
  getAccountByNumber,
  getAccountsByUserId,
} from '../controllers/account.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createAccountSchema,
  getAccountByNumberSchema,
  getAccountsByUserIdSchema,
} from '../schemas/account.schema.js';

export const accountRouter = express.Router();

accountRouter.post('/', validate(createAccountSchema), createAccount);
accountRouter.get('/:accountNumber', validate(getAccountByNumberSchema), getAccountByNumber);
accountRouter.get('/user/:userId', validate(getAccountsByUserIdSchema), getAccountsByUserId);
