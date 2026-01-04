import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '193.203.184.109',
  user: process.env.DB_USER || 'u217412984_vendro',
  password: process.env.DB_PASSWORD || 'Vendro@123',
  database: process.env.DB_NAME || 'u217412984_vendro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log("✅ Connected to MySQL Database");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Database Connection Failed:", err);
  });
