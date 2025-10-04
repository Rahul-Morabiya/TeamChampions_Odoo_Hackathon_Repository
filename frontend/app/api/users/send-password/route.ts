import { NextResponse } from "next/server"
import { db } from "@/frontend/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const user = db.users.find((u) => u.id === id)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  const pass = db.passwords.get(user.id) || user.password
  console.log("[v0] Simulated email password:", pass)
  return NextResponse.json({ ok: true, password: pass })
}
