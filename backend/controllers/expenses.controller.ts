import { Request, Response } from 'express';
import { Expense } from '../models/expense.model';

// Get all expenses (optionally filter by status)
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    const expenses = await Expense.find(filter).populate("userId", "name email role");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// Get expenses for the logged-in user
export const getMyExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your expenses" });
  }
};

// Create a new expense
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, category, date, description } = req.body;
    const userId = (req as any).user?.id;
    if (!amount || !category || !date || !userId) {
      return res.status(400).json({ message: 'Missing fields.' });
    }
    const expense = new Expense({
      amount,
      category,
      date,
      description,
      status: 'pending',
      userId,
      createdAt: new Date(),
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Failed to create expense" });
  }
};

// Update expense status (for approver/admin)
export const updateExpenseStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    expense.status = status;
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Failed to update expense status" });
  }
};