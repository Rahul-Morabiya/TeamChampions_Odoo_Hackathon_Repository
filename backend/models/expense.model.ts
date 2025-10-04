import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  amount: number;
  category: string;
  date: string;
  description: string;
  status: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);