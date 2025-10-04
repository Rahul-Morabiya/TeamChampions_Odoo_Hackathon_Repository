"use client"

import useSWR from "swr"
import { PendingList } from "@/components/approver/pending-list"
import { fetcher } from "@/frontend/lib/fetcher"

export default function ApproverDashboard() {
  const { data: me } = useSWR("/api/auth/me", fetcher)
  if (!(me?.user && (me.user.role === "manager" || me.user.role === "admin"))) {
    return <p className="text-muted-foreground">You must be a Manager/Admin to view this page.</p>
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-pretty">Approver Dashboard</h1>
      <PendingList />
    </div>
  )
}
