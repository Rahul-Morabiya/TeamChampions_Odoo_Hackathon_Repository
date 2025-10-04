export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'approver' | 'employee';
}

export const users: User[] = [
  // Example user for testing
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$abcdefghijklmnopqrstuv', // bcrypt hash
    name: 'Admin User',
    role: 'admin',
  },
];