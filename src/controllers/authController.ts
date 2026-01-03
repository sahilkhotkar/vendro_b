import bcrypt from 'bcryptjs';
import { pool } from '../config/db';

export const login = async (req: any, res: any) => {
  const { email, password, role } = req.body;
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    const { password: _, ...userWithoutPassword } = user;
    // In a real app, generate JWT here
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const register = async (req: any, res: any) => {
  const user = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    // Prepare object for insertion
    const dbUser = {
      ...user,
      password: hashedPassword,
      isApproved: user.role === 'admin' ? 1 : 0, // Admins auto-approve for demo simplicity, or set to 0
      services: JSON.stringify(user.services || []),
      portfolioImages: JSON.stringify(user.portfolioImages || [])
    };

    const [result] = await pool.query('INSERT INTO users SET ?', [dbUser]);
    res.status(201).json({ message: 'User registered successfully', id: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};