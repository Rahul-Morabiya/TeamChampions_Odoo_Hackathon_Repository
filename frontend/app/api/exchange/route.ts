import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const base = searchParams.get("base") || "USD"
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${encodeURIComponent(base)}`, {
    cache: "no-store",
  })
  const data = await res.json()
  return NextResponse.json(data)
}
