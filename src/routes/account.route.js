import express from 'express';

import {
  createAccount,
  getAccountByNumber,
  getAccountsByUserId,
} from '../controllers/account.controller.js';

export const accountRouter = express.Router();

accountRouter.post('/', createAccount);
accountRouter.get('/:accountNumber', getAccountByNumber);
accountRouter.get('/user/:userId', getAccountsByUserId);
