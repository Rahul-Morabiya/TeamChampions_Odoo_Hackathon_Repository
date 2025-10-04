import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/frontend/lib/db"

export async function POST() {
  const cookieStore = cookies()
  const token = cookieStore.get("session")?.value
  if (token) db.sessions.delete(token)
  cookieStore.set("session", "", { path: "/", maxAge: 0 })
  return NextResponse.json({ ok: true })
}
