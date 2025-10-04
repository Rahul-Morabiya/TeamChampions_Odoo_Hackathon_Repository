"use client"

import useSWR from "swr"
import { fetcher } from "@/frontend/lib/fetcher"

const badge = (status: string) => {
  const map: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    waiting: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300",
  }
  return map[status] || "bg-muted text-muted-foreground"
}

export function ExpenseList() {
  const { data, mutate } = useSWR("/api/expenses", fetcher)
  const expenses = data?.expenses ?? []

  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Employee</th>
            <th className="text-left p-3">Description</th>
            <th className="text-left p-3">Date</th>
            <th className="text-left p-3">Category</th>
            <th className="text-left p-3">Paid By</th>
            <th className="text-left p-3">Amount</th>
            <th className="text-left p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((x: any) => (
            <tr key={x.id} className="border-t">
              <td className="p-3">{x.employeeName}</td>
              <td className="p-3">{x.description}</td>
              <td className="p-3">{x.expenseDate}</td>
              <td className="p-3">{x.category}</td>
              <td className="p-3">{x.paidBy}</td>
              <td className="p-3">
                {x.amount} {x.currency} ({x.baseAmount.toFixed(2)} {x.baseCurrency})
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded ${badge(x.status)}`}>{x.status}</span>
              </td>
            </tr>
          ))}
          {!expenses.length && (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={7}>
                No expenses yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
