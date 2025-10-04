"use client"

import type React from "react"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { fetcher } from "@/frontend/lib/fetcher"

type Rule = {
  id: string
  name: string
  description?: string
  userId: string
  managerId?: string
  approvers: { userId: string; sequence: number; isManagerApprover?: boolean }[]
  type: "sequential" | "percentage" | "hybrid"
  requiredPercent?: number
  minApprovalPercent?: number
}

export function RulesConfig() {
  const { data: usersData } = useSWR("/api/users", fetcher)
  const users = usersData?.users ?? []
  const { data: rulesData, mutate } = useSWR("/api/rules", fetcher)
  const rules = rulesData?.rules ?? []

  const [form, setForm] = useState<Rule>({
    id: "",
    name: "",
    description: "",
    userId: "",
    managerId: "",
    approvers: [],
    type: "sequential",
    requiredPercent: 100,
    minApprovalPercent: 0,
  })

  const approverOptions = useMemo(() => users.filter((u: any) => u.role === "manager" || u.role === "admin"), [users])

  const addApprover = (userId: string) => {
    if (!userId) return
    setForm((f) => ({
      ...f,
      approvers: [...f.approvers, { userId, sequence: f.approvers.length + 1, isManagerApprover: false }],
    }))
  }

  const removeApprover = (userId: string) => {
    setForm((f) => ({ ...f, approvers: f.approvers.filter((a) => a.userId !== userId) }))
  }

  const saveRule = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({
        id: "",
        name: "",
        description: "",
        userId: "",
        managerId: "",
        approvers: [],
        type: "sequential",
        requiredPercent: 100,
        minApprovalPercent: 0,
      })
      mutate()
    } else {
      alert("Failed to save rule")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={saveRule} className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Rule Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>User</Label>
            <Select value={form.userId} onValueChange={(userId) => setForm({ ...form, userId })}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Assign Manager</Label>
            <Select value={form.managerId || "none"} onValueChange={(managerId) => setForm({ ...form, managerId })}>
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {approverOptions.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="grid gap-2">
            <Label>Rule Type</Label>
            <Select value={form.type} onValueChange={(type: any) => setForm({ ...form, type })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">Sequential</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Required %</Label>
            <Input
              type="number"
              value={form.requiredPercent ?? 100}
              onChange={(e) => setForm({ ...form, requiredPercent: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Min Approval %</Label>
            <Input
              type="number"
              value={form.minApprovalPercent ?? 0}
              onChange={(e) => setForm({ ...form, minApprovalPercent: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Approvers (with sequence)</Label>
          <div className="flex items-center gap-2">
            <Select onValueChange={addApprover}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Add approver" />
              </SelectTrigger>
              <SelectContent>
                {approverOptions
                  .filter((a: any) => !form.approvers.find((x) => x.userId === a.id))
                  .map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Approver</th>
                  <th className="text-left p-2">Sequence</th>
                  <th className="text-left p-2">Is Manager Approver?</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {form.approvers.map((a, idx) => {
                  const name = users.find((u: any) => u.id === a.userId)?.name || a.userId
                  return (
                    <tr key={a.userId} className="border-t">
                      <td className="p-2">{name}</td>
                      <td className="p-2">
                        <Input
                          className="w-24"
                          type="number"
                          value={a.sequence}
                          onChange={(e) => {
                            const seq = Number(e.target.value)
                            setForm((f) => ({
                              ...f,
                              approvers: f.approvers.map((x) => (x.userId === a.userId ? { ...x, sequence: seq } : x)),
                            }))
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={!!a.isManagerApprover}
                            onCheckedChange={(checked) => {
                              setForm((f) => ({
                                ...f,
                                approvers: f.approvers.map((x) =>
                                  x.userId === a.userId ? { ...x, isManagerApprover: !!checked } : x,
                                ),
                              }))
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <Button size="sm" variant="secondary" onClick={() => removeApprover(a.userId)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {!form.approvers.length && (
                  <tr>
                    <td colSpan={4} className="p-2 text-muted-foreground">
                      No approvers yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <Button type="submit">Save Rule</Button>
        </div>
      </form>

      <div className="space-y-2">
        <h3 className="font-medium">Existing Rules</h3>
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2">Rule</th>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Approvers</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{users.find((u: any) => u.id === r.userId)?.name || r.userId}</td>
                  <td className="p-2 capitalize">{r.type}</td>
                  <td className="p-2">
                    {r.approvers
                      ?.map((a: any) => users.find((u: any) => u.id === a.userId)?.name || a.userId)
                      .join(", ")}
                  </td>
                </tr>
              ))}
              {!rules.length && (
                <tr>
                  <td className="p-2 text-muted-foreground" colSpan={4}>
                    No rules yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
