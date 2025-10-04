import { Router } from 'express';
import { getExpenses, createExpense, updateExpenseStatus } from '../controllers/expenses.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getExpenses);
router.post('/', authenticate, createExpense);
router.patch('/:id/status', authenticate, updateExpenseStatus);

export default router;