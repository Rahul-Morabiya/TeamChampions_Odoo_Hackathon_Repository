import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db, id } from "@/frontend/lib/db"
import type { User } from "@/frontend/lib/types"

export async function GET() {
  const token = cookies().get("session")?.value
  const userId = token ? db.sessions.get(token) : undefined
  const me = userId ? db.users.find((u) => u.id === userId) : undefined
  const company = me ? db.companies.find((c) => c.id === me.companyId) : null
  const users = me ? db.users.filter((u) => u.companyId === me.companyId) : []
  return NextResponse.json({ users, company })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, role, managerId } = body || {}
  const token = (await cookies()).get("session")?.value
  const userId = token ? db.sessions.get(token) : undefined
  const me = userId ? db.users.find((u) => u.id === userId) : undefined
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const exists = db.users.find((u) => u.email === email && u.companyId === me.companyId)
  if (exists) return NextResponse.json({ error: "User exists" }, { status: 400 })
  const password = Math.random().toString(36).slice(2, 8)
  const user: User = {
    id: id(),
    name,
    email,
    password,
    role: role === "manager" ? "manager" : "employee",
    managerId: managerId || undefined,
    companyId: me.companyId,
  }
  db.users.push(user)
  db.passwords.set(user.id, password)
  return NextResponse.json({ ok: true, user })
}
