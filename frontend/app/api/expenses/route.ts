import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db, id } from "@/frontend/lib/db"
import type { Expense } from "@/frontend/lib/types"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pendingOnly = !!searchParams.get("pending")
  const token = cookies().get("session")?.value
  const uid = token ? db.sessions.get(token) : undefined
  const me = uid ? db.users.find((u) => u.id === uid) : undefined
  if (!me) return NextResponse.json({ expenses: [] })

  let expenses = db.expenses.filter((e) => db.users.find((u) => u.id === e.employeeId)?.companyId === me.companyId)
  if (pendingOnly) {
    // Show items in "waiting" that me can approve (if manager/admin)
    expenses = expenses.filter((e) => e.status === "waiting")
  }
  return NextResponse.json({ expenses })
}

export async function POST(req: Request) {
  const body = await req.json()
  const token = cookies().get("session")?.value
  const uid = token ? db.sessions.get(token) : undefined
  const me = uid ? db.users.find((u) => u.id === uid) : undefined
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const exp: Expense = {
    id: id(),
    employeeId: me.id,
    employeeName: me.name,
    description: body.description,
    expenseDate: body.expenseDate,
    paidBy: body.paidBy,
    category: body.category,
    amount: Number(body.amount),
    currency: body.currency,
    baseAmount: Number(body.baseAmount),
    baseCurrency: body.baseCurrency,
    status: "waiting", // from draft to waiting once submitted
    approvals: [],
  }
  db.expenses.push(exp)
  return NextResponse.json({ ok: true, expense: exp })
}
