"use client"

import useSWR from "swr"
import { ExpenseForm } from "@/components/employee/expense-form"
import { ExpenseList } from "@/components/employee/expense-list"
import { fetcher } from "@/frontend/lib/fetcher"

export default function EmployeeDashboard() {
  const { data: me } = useSWR("/api/auth/me", fetcher)
  if (!me?.user) {
    return <p className="text-muted-foreground">Please login to view this page.</p>
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-pretty">Employee Dashboard</h1>
      <ExpenseForm />
      <ExpenseList />
    </div>
  )
}
