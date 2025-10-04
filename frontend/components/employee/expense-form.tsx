"use client"

import type React from "react"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { fetcher } from "@/frontend/lib/fetcher"

const categories = ["Food", "Travel", "Misc"]

export function ExpenseForm() {
  const { data: me } = useSWR("/api/auth/me", fetcher)
  const { data: company } = useSWR("/api/users?company=1", fetcher) // returns company in payload
  const baseCurrency = company?.company?.baseCurrency || "USD"

  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    description: "",
    expenseDate: "",
    paidBy: "",
    category: "",
    amount: "",
    currency: "USD",
    vendor: "",
  })
  const [converted, setConverted] = useState<number | null>(null)

  useEffect(() => {
    const convert = async () => {
      if (!form.amount || !form.currency) return setConverted(null)
      if (form.currency === baseCurrency) return setConverted(Number(form.amount))
      const res = await fetch(`/api/exchange?base=${baseCurrency}`)
      if (res.ok) {
        const data = await res.json()
        const rate = data.rates?.[form.currency] ? 1 / data.rates[form.currency] : null
        if (rate) setConverted(Number(form.amount) * rate)
        else setConverted(null)
      }
    }
    convert()
  }, [form.amount, form.currency, baseCurrency])

  const tryOCR = async () => {
    if (!file) return alert("Upload a receipt file first.")
    if (file.type.startsWith("text/")) {
      const txt = await file.text()
      const amountMatch = txt.match(/(\d+(\.\d{2})?)/)
      const dateMatch = txt.match(/(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/)
      setForm((f) => ({
        ...f,
        description: f.description || "Extracted expense",
        amount: f.amount || (amountMatch ? amountMatch[1] : ""),
        expenseDate: f.expenseDate || (dateMatch ? dateMatch[0].replace(/\//g, "-") : ""),
        vendor: f.vendor || "Extracted Vendor",
      }))
    } else {
      alert("OCR demo supports simple .txt receipts in this preview.")
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        baseAmount: converted ?? Number(form.amount),
        baseCurrency,
      }),
    })
    if (res.ok) {
      setForm({ description: "", expenseDate: "", paidBy: "", category: "", amount: "", currency: "USD", vendor: "" })
      setFile(null)
      alert("Expense saved as draft")
    } else {
      alert("Failed to save expense")
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-2">
          <Label>Upload Receipt</Label>
          <Input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button type="button" variant="secondary" onClick={tryOCR}>
            Try OCR (beta)
          </Button>
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Expense Date</Label>
          <Input
            type="date"
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <div className="grid gap-2">
          <Label>Paid By</Label>
          <Input value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(category) => setForm({ ...form, category })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Amount</Label>
          <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Currency</Label>
          <Select value={form.currency} onValueChange={(currency) => setForm({ ...form, currency })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label>Vendor</Label>
          <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
        </div>
        <div className="grid gap-1">
          <Label>Converted to Base Currency ({baseCurrency})</Label>
          <div className="text-sm text-muted-foreground">{converted ? converted.toFixed(2) : "—"}</div>
        </div>
      </div>

      <Button type="submit">Save Draft</Button>
    </form>
  )
}
