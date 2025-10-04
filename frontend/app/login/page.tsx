import Navbar from "@/components/Navbar";
import LoginForm from "@/components/forms/login-form"; // For Login.tsx
// import SignupForm from "@/components/forms/signup-form"; // For Signup.tsx

export default function Login() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#e0e9f7] via-[#f2faff] to-[#f0eeff]">
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center pt-24">
        <section className="max-w-md w-full space-y-7 p-8 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-slate-200 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary text-center drop-shadow-lg">
            Login
          </h1>
          <LoginForm />
        </section>
      </main>
    </div>
  );
}