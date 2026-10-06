import { pool } from '../db.js';

export const createAccount = async (req, res) => {
  try {
    const { user_id, initial_deposit = 0 } = req.validatedData.body;
    console.log(req.validatedData.body);

    // Business Logic Guard: initial deposit should not lower than 500
    if (initial_deposit < 500) {
      return res.status(400).json({
        status: 'fail',
        message: 'Minimum initial deposit for opening an account is 500 Baht',
      });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found. Cannot create account.',
      });
    }

    // Generate 10-digit Account Number
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Save into db
    const query = `
      INSERT INTO accounts (user_id, account_number, balance)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [user_id, accountNumber, initial_deposit]);

    res.status(201).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAccountByNumber = async (req, res) => {
  try {
    const { accountNumber } = req.validatedData.params;

    const query = `
      SELECT 
        a.id,
        a.account_number,
        a.account_type,
        a.balance,
        a.created_at,
        u.full_name AS owner_name,
        u.email AS owner_email
      FROM accounts a
      JOIN users u ON a.user_id = u.id
      WHERE a.account_number = $1;
    `;

    const result = await pool.query(query, [accountNumber]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Account not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAccountsByUserId = async (req, res) => {
  try {
    const { userId } = req.validatedData.params;

    const result = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Account not found',
      });
    }

    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
