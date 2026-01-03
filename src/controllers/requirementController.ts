import { pool } from '../config/db';

export const getRequirements = async (req: any, res: any) => {
  try {
    const [rows] = await pool.query('SELECT * FROM requirements ORDER BY postedDate DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements', error });
  }
};

export const createRequirement = async (req: any, res: any) => {
  const reqData = req.body;
  try {
    await pool.query('INSERT INTO requirements SET ?', [reqData]);
    res.status(201).json({ message: 'Requirement posted' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating requirement', error });
  }
};