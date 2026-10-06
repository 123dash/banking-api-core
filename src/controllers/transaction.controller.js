import { pool } from '../db.js';

export const deposit = async (req, res) => {
  try {
    const { account_number, amount } = req.validatedData.body;

    // Business Logic: deposit amount must not be zero or lower
    if (amount <= 0) {
      return res.status(400).json({ status: 'fail', message: 'Amount must be greater than 0' });
    }

    // Check if acc exists
    const accCheck = await pool.query(
      'SELECT id, balance FROM accounts WHERE account_number = $1',
      [account_number],
    );
    if (accCheck.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Account not found' });
    }

    const account = accCheck.rows[0];

    // Update account balance in the db
    await pool.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [
      amount,
      account.id,
    ]);

    const logQuery = `
          INSERT INTO transactions (receiver_account_id, transaction_type, amount)
          VALUES ($1, 'DEPOSIT', $2)
          RETURNING *;
        `;
    const logResult = await pool.query(logQuery, [account.id, amount]);

    res.status(200).json({
      status: 'success',
      message: 'Deposit successful',
      transaction: logResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const withdraw = async (req, res) => {
  try {
    const { account_number, amount } = req.validatedData.body;

    // Business Logic: deposit amount must not be zero or lower
    if (amount <= 0) {
      return res.status(400).json({ status: 'fail', message: 'Amount must be greater than 0' });
    }

    // Check if acc exists
    const accCheck = await pool.query(
      'SELECT id, balance FROM accounts WHERE account_number = $1',
      [account_number],
    );
    if (accCheck.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Account not found' });
    }

    const account = accCheck.rows[0];

    // Business Logic: Check if account balance lower than the amount
    if (Number(account.balance) < amount) {
      return res.status(400).json({ status: 'fail', message: 'Insufficient funds' });
    }

    await pool.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [
      amount,
      account.id,
    ]);

    const logQuery = `
          INSERT INTO transactions (sender_account_id, transaction_type, amount)
          VALUES ($1, 'WITHDRAW', $2)
          RETURNING *;
        `;
    const logResult = await pool.query(logQuery, [account.id, amount]);

    res.status(200).json({
      status: 'success',
      message: 'Withdrawal successful',
      transaction: logResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const transfer = async (req, res) => {
  // Check required inputs
  const { sender_account_number, receiver_account_number, amount } = req.validatedData.body;

  // Check invalid amount or self transfer
  if (amount <= 0 || sender_account_number === receiver_account_number) {
    return res.status(400).json({ status: 'fail', message: 'Invalid transaction parameters' });
  }

  // Get client connection from pool
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Get and lock sender account (prevent race condition)
    const senderRes = await client.query(
      'SELECT id, balance FROM accounts WHERE account_number = $1 FOR UPDATE',
      [sender_account_number],
    );

    if (senderRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'fail', message: 'Sender account not found' });
    }

    const sender = senderRes.rows[0];

    // Check balance
    if (Number(sender.balance) < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'fail', message: 'Insufficient funds' });
    }

    // Get and lock receiver account
    const receiverRes = await client.query(
      'SELECT id FROM accounts WHERE account_number = $1 FOR UPDATE',
      [receiver_account_number],
    );

    if (receiverRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'fail', message: 'Receiver account not found' });
    }

    const receiver = receiverRes.rows[0];

    // Update balances
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [
      amount,
      sender.id,
    ]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [
      amount,
      receiver.id,
    ]);

    // Save transaction history
    const logQuery = `
      INSERT INTO transactions (sender_account_id, receiver_account_id, transaction_type, amount)
      VALUES ($1, $2, 'TRANSFER', $3)
      RETURNING *;
    `;
    const logResult = await client.query(logQuery, [sender.id, receiver.id, amount]);

    // Save changes
    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Transfer completed safely',
      transaction: logResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    // Always release connection back to pool
    client.release();
  }
};

export const getStatement = async (req, res) => {
  try {
    const { accountNumber } = req.validatedData.params;

    // Check if account exists
    const accCheck = await pool.query('SELECT id FROM accounts WHERE account_number = $1', [
      accountNumber,
    ]);
    if (accCheck.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Account not found' });
    }

    const accountId = accCheck.rows[0].id;

    // select all the statement from account id
    const query = `
      SELECT * FROM transactions
      WHERE sender_account_id = $1 OR receiver_account_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [accountId]);

    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
