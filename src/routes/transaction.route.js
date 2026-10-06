import express from 'express';
import {
  deposit,
  withdraw,
  transfer,
  getStatement,
} from '../controllers/transaction.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  depositSchema,
  getStatementSchema,
  transferSchema,
  withdrawSchema,
} from '../schemas/transaction.schema.js';

export const transactionRouter = express.Router();

transactionRouter.post('/deposit', validate(depositSchema), deposit);
transactionRouter.post('/withdraw', validate(withdrawSchema), withdraw);
transactionRouter.post('/transfer', validate(transferSchema), transfer);
transactionRouter.get('/statement/:accountNumber', validate(getStatementSchema), getStatement);
