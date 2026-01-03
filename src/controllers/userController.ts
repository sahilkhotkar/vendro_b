import { pool } from '../config/db';

export const getAllUsers = async (req: any, res: any) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, isApproved, location, avatar, category, rating, reviewCount, hourlyRate, experienceYears, description, services, portfolioImages, industry, companySize, website FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const approveUser = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE users SET isApproved = 1 WHERE id = ?', [id]);
    res.json({ message: 'User approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving user', error });
  }
};

export const rejectUser = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User rejected/deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting user', error });
  }
};

export const updateUser = async (req: any, res: any) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        await pool.query('UPDATE users SET ? WHERE id = ?', [updates, id]);
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};