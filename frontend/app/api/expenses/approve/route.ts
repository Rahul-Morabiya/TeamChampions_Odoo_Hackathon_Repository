import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/frontend/lib/db"
import { advanceStatus } from "@/frontend/lib/approval"

export async function POST(req: Request) {
  const { expenseId, decision, comments } = await req.json()
  const token = cookies().get("session")?.value
  const uid = token ? db.sessions.get(token) : undefined
  const me = uid ? db.users.find((u) => u.id === uid) : undefined
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const expense = db.expenses.find((e) => e.id === expenseId)
  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Only managers/admins can approve
  if (!(me.role === "manager" || me.role === "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  advanceStatus(expense, decision, me.id)
  return NextResponse.json({ ok: true, expense })
}
