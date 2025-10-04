import { NextResponse } from "next/server"
import { db } from "@/frontend/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })
  const user = db.users.find((u) => u.email === email)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  const newPass = Math.random().toString(36).slice(2, 8)
  user.password = newPass
  db.passwords.set(user.id, newPass)
  console.log("[v0] Simulated email password:", newPass)
  return NextResponse.json({ ok: true, password: newPass })
}
