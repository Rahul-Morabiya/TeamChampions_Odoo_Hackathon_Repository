"use client"

import useSWR from "swr"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserTable } from "@/components/admin/user-table"
import { RulesConfig } from "@/components/admin/rules-config"
import { fetcher } from "@/frontend/lib/fetcher"

export default function AdminDashboard() {
  const { data: me } = useSWR("/api/auth/me", fetcher)
  if (me?.user?.role !== "admin") {
    return <p className="text-muted-foreground">You must be an Admin to view this page.</p>
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-pretty">Admin Dashboard</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="rules">Approval Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserTable />
        </TabsContent>
        <TabsContent value="rules">
          <RulesConfig />
        </TabsContent>
      </Tabs>
    </div>
  )
}
