import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db, id } from "@/frontend/lib/db"
import type { ApprovalRule } from "@/frontend/lib/types"

export async function GET() {
  const token = cookies().get("session")?.value
  const uid = token ? db.sessions.get(token) : undefined
  const me = uid ? db.users.find((u) => u.id === uid) : undefined
  if (!me) return NextResponse.json({ rules: [] })
  const rules = db.rules.filter((r) => db.users.find((u) => u.id === r.userId)?.companyId === me.companyId)
  return NextResponse.json({ rules })
}

export async function POST(req: Request) {
  const body: ApprovalRule = await req.json()
  const token = cookies().get("session")?.value
  const uid = token ? db.sessions.get(token) : undefined
  const me = uid ? db.users.find((u) => u.id === uid) : undefined
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const rule: ApprovalRule = {
    ...body,
    id: id(),
    approvers: (body.approvers || []).sort((a, b) => a.sequence - b.sequence),
  }
  db.rules.push(rule)
  return NextResponse.json({ ok: true, rule })
}
