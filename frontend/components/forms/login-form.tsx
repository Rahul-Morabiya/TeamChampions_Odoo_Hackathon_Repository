"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push("/(dashboard)/employee")
    } else {
      alert("Invalid credentials")
    }
  }

  const forgot = async () => {
    const res = await fetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`)
    if (res.ok) {
      const data = await res.json()
      alert(`Password sent (simulated). New password: ${data.password}`)
    } else {
      alert("Unable to send password")
    }
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={!email || !password} loading={loading}>
          Login
        </Button>
        <Button type="button" variant="secondary" onClick={forgot}>
          Forgot Password
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link className="underline" href="/signup">
          Signup
        </Link>
      </p>
    </form>
  )
}
