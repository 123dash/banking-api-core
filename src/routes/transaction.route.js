import express from 'express';
import {
  deposit,
  withdraw,
  transfer,
  getStatement,
} from '../controllers/transaction.controller.js';

export const transactionRouter = express.Router();

transactionRouter.post('/deposit', deposit);
transactionRouter.post('/withdraw', withdraw);
transactionRouter.post('/transfer', transfer);
transactionRouter.get('/statement/:accountNumber', getStatement);
