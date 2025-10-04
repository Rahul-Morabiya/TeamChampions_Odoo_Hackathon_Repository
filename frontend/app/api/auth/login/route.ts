import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db, id } from "@/frontend/lib/db"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const user = db.users.find((u) => u.email === email && u.password === password)
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  const token = id()
  db.sessions.set(token, user.id)
  cookies().set("session", token, { httpOnly: true, sameSite: "lax", path: "/" })
  return NextResponse.json({ ok: true })
}
