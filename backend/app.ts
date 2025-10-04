import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import expensesRoutes from './routes/expense.routes';
import { errorHandler } from './middlewares/error.middleware';
import { connectDB } from "./db";

connectDB();
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/expenses', expensesRoutes);

app.get('/', (_req, res) => {
  res.send('Backend API is running');
});

app.use(errorHandler);

export default app;