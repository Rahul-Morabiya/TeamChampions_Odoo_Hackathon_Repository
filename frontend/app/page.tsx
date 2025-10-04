import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#e0e9f7] via-[#f2faff] to-[#f0eeff]">
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center pt-24">
        <section className="max-w-xl w-full text-center space-y-8 p-8 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-slate-200 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary drop-shadow-lg">
            Welcome to{" "}
            <span className="from-primary to-blue-500 bg-gradient-to-r text-transparent bg-clip-text">
              Expense Approvals
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Effortlessly submit expenses,<br />
            configure approval rules, and manage requests<br />
            with a modern, intuitive interface.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="transition-all duration-300 hover:scale-105">
              <Link href="/signup">Get Started as Admin</Link>
            </Button>
            <Button variant="secondary" asChild size="lg" className="transition-all duration-300 hover:scale-105">
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary">
              Sign up now
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
