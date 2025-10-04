import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
  return (
    <main className="container mx-auto max-w-md py-10">
      <h1 className="text-2xl font-semibold mb-6 text-pretty">Login</h1>
      <LoginForm />
    </main>
  )
}
