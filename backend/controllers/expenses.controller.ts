import { Request, Response } from 'express';
import { expenses } from '../models/expense.model';

export const getExpenses = (_req: Request, res: Response) => {
  res.json(expenses);
};

export const createExpense = (req: Request, res: Response) => {
  const { title, amount, status, userId } = req.body;
  if (!title || !amount || !userId) {
    return res.status(400).json({ message: 'Missing fields.' });
  }
  const expense = {
    id: expenses.length + 1,
    title,
    amount,
    status: status || 'pending',
    userId,
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);
  res.status(201).json(expense);
};

export const updateExpenseStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const expense = expenses.find(e => e.id === Number(id));
  if (!expense) return res.status(404).json({ message: 'Expense not found.' });
  expense.status = status;
  res.json(expense);
};