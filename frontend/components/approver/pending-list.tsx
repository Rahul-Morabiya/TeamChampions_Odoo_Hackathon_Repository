"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/frontend/lib/fetcher"

export function PendingList() {
  const { data, mutate } = useSWR("/api/expenses?pending=1", fetcher)
  const items = data?.expenses ?? []

  const act = async (id: string, decision: "approve" | "reject") => {
    const res = await fetch("/api/expenses/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: id, decision, comments: "" }),
    })
    if (res.ok) mutate()
    else alert("Action failed")
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Employee</th>
            <th className="text-left p-3">Description</th>
            <th className="text-left p-3">Amount</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x: any) => (
            <tr key={x.id} className="border-t">
              <td className="p-3">{x.employeeName}</td>
              <td className="p-3">{x.description}</td>
              <td className="p-3">
                {x.baseAmount.toFixed(2)} {x.baseCurrency}
              </td>
              <td className="p-3">{x.status}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => act(x.id, "approve")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => act(x.id, "reject")}>
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={5}>
                No pending items
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
