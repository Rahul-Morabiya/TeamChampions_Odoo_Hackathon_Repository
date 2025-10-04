import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpenseStatus,
  getMyExpenses,
} from "../controllers/expenses.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/my", authMiddleware, getMyExpenses);
router.patch("/:id/status", authMiddleware, updateExpenseStatus);

export default router;