import { pool } from '../db.js';

export const createUser = async (req, res) => {
  try {
    const { full_name, email } = req.validatedData.body;
    console.log(req.validatedData.body);

    const query = `
      INSERT INTO users (full_name, email)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [full_name, email];

    const result = await pool.query(query, values);

    res.status(201).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.validatedData.params;
    console.log(req.validatedData.params);

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
};
