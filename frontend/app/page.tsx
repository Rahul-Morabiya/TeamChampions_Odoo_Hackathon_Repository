import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-pretty">Expense Approvals Platform</h1>
        <p className="text-muted-foreground">
          Submit expenses, configure approval rules, and approve requests with a modern dark UI.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/signup">Create Admin</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
