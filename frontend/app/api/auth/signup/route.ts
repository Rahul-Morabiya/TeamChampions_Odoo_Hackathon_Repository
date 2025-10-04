import { NextResponse } from "next/server"
import { db, id } from "@/frontend/lib/db"
import type { Company, User } from "@/frontend/lib/types"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, country } = body || {}
  if (!name || !email || !password || !country) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Fetch country to get currency
  const res = await fetch("https://restcountries.com/v3.1/all?fields=currencies,cca2", { cache: "force-cache" })
  const list = await res.json()
  const match = (list || []).find((x: any) => x.cca2 === country)
  const baseCurrency = match?.currencies ? Object.keys(match.currencies)[0] : "USD"

  const company: Company = {
    id: id(),
    name: `${name}'s Company`,
    countryCode: country,
    baseCurrency,
  }
  db.companies.push(company)

  const admin: User = {
    id: id(),
    name,
    email,
    password,
    role: "admin",
    companyId: company.id,
  }
  db.users.push(admin)

  // Optionally auto-login new admin
  return NextResponse.json({ ok: true, company, admin })
}
