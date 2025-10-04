import { SignupForm } from "@/components/forms/signup-form"

export default function SignupPage() {
  return (
    <main className="container mx-auto max-w-2xl py-10">
      <h1 className="text-2xl font-semibold mb-6 text-pretty">Company Admin Signup</h1>
      <SignupForm />
    </main>
  )
}
