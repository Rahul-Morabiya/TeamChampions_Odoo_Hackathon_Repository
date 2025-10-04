import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/frontend/lib/db"
import { findCompanyByUser } from "@/frontend/lib/db"

export async function GET() {
  const token = cookies().get("session")?.value
  const userId = token ? db.sessions.get(token) : undefined
  const user = userId ? db.users.find((u) => u.id === userId) : undefined
  const company = user ? findCompanyByUser(user.id) : null
  return NextResponse.json({ user, company })
}
