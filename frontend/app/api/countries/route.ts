import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies,cca2", { cache: "force-cache" })
  const countries = await res.json()
  const mapped = (countries || [])
    .map((c: any) => {
      const code = c?.cca2
      const name = c?.name?.common
      const currency = c?.currencies ? Object.keys(c.currencies)[0] : "USD"
      return { code, name, currency }
    })
    .filter((c: any) => c.code && c.name)
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
  return NextResponse.json(mapped)
}
