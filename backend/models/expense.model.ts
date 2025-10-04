export interface Expense {
  id: number;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  userId: number;
  createdAt: string;
}

export const expenses: Expense[] = [];