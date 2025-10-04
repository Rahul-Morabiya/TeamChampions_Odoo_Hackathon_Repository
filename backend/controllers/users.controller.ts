import { Request, Response } from 'express';
import { users } from '../models/user.model';

export const getUsers = (_req: Request, res: Response) => {
  res.json(users.map(({ password, ...rest }) => rest));
};

export const getUserById = (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const { password, ...rest } = user;
  res.json(rest);
};