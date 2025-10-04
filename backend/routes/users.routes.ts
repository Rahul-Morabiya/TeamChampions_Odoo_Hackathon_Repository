import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/users.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getUsers);
router.get('/:id', authenticate, getUserById);

export default router;