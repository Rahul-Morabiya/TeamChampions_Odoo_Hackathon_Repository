// Core types for the app (frontend shared)
export type Role = "admin" | "manager" | "employee"

export type Company = {
  id: string
  name: string
  countryCode: string
  baseCurrency: string
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: Role
  managerId?: string
  companyId: string
}

export type ApprovalRule = {
  id: string
  name: string
  description?: string
  userId: string
  managerId?: string
  approvers: { userId: string; sequence: number; isManagerApprover?: boolean }[]
  type: "sequential" | "percentage" | "hybrid"
  requiredPercent?: number
  minApprovalPercent?: number
}

export type Expense = {
  id: string
  employeeId: string
  employeeName: string
  description: string
  expenseDate: string
  paidBy: string
  category: string
  amount: number
  currency: string
  baseAmount: number
  baseCurrency: string
  status: "draft" | "waiting" | "approved" | "rejected"
  approvals: { approverId: string; decision: "approve" | "reject"; at: string }[]
}
