"use client"

import type React from "react"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { fetcher } from "@/frontend/lib/fetcher"

export function UserTable() {
  const { data, mutate } = useSWR("/api/users", fetcher)
  const users = data?.users ?? []
  const managers = users.filter((u: any) => u.role === "manager" || u.role === "admin")

  const [form, setForm] = useState({ name: "", email: "", role: "employee", managerId: "none" })

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: "", email: "", role: "employee", managerId: "none" })
      mutate()
    } else {
      alert("Failed to create user")
    }
  }

  const sendPassword = async (id: string) => {
    const res = await fetch(`/api/users/send-password?id=${id}`)
    if (res.ok) {
      const data = await res.json()
      alert(`Password sent (simulated). Password: ${data.password}`)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createUser} className="grid md:grid-cols-4 gap-3 items-end">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Manager</Label>
          <Select value={form.managerId} onValueChange={(managerId) => setForm({ ...form, managerId })}>
            <SelectTrigger>
              <SelectValue placeholder="Assign manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {managers.map((m: any) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button type="submit" className="w-full md:w-auto">
            Create
          </Button>
        </div>
      </form>

      <div className="border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Manager</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{users.find((m: any) => m.id === u.managerId)?.name || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <Button size="sm" variant="secondary" onClick={() => sendPassword(u.id)}>
                    Send Password
                  </Button>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
