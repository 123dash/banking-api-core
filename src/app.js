import express from 'express';
import { userRouter } from './routes/user.route.js';
import { accountRouter } from './routes/account.route.js';
import { transactionRouter } from './routes/transaction.route.js';

export const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/transactions', transactionRouter);

app.use((req, res) => res.status(404).json({ status: 'error', message: 'Endpoints not found' }));
