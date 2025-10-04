import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  title: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);