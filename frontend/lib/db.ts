// In-memory store for preview/demo purposes
import { randomUUID } from "crypto"
import type { ApprovalRule, Company, Expense, User } from "./types"

type DB = {
  companies: Company[]
  users: User[]
  rules: ApprovalRule[]
  expenses: Expense[]
  sessions: Map<string, string> // token -> userId
  passwords: Map<string, string> // userId -> last generated password
}

const globalAny = globalThis as any
if (!globalAny.__DB__) {
  globalAny.__DB__ = {
    companies: [],
    users: [],
    rules: [],
    expenses: [],
    sessions: new Map(),
    passwords: new Map(),
  } as DB
}

export const db: DB = globalAny.__DB__

export function id() {
  // Works in Next.js since node polyfills are available in server context
  try {
    return randomUUID()
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

export function findCompanyByUser(userId: string) {
  const user = db.users.find((u) => u.id === userId)
  if (!user) return null
  return db.companies.find((c) => c.id === user.companyId) || null
}
