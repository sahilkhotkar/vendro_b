import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import requirementRoutes from './routes/requirementRoutes';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
// CHANGED: Default to 5000 to avoid conflict with React/Vite defaults
const PORT = process.env.PORT || 10000;

app.use(cors() as any);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
  res.send('Vendro API is running. Access the UI at http://localhost:5173');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👉 API Endpoint: http://localhost:${PORT}/api`);
});