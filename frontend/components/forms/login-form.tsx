"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);

      // Fetch user info using the token
      const userRes = await fetch("http://localhost:3001/auth/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userRes.json();

      // Redirect based on role
      switch (userData.role) {
        case "admin":
          router.push("/admin");
          break;
        case "approver":
          router.push("/approver");
          break;
        case "employee":
        default:
          router.push("/employee");
          break;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div>
        <label className="block mb-1 font-medium text-primary" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/80 transition"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-primary" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/80 transition"
        />
      </div>
      {error && <div className="text-red-600 text-sm text-center animate-shake">{error}</div>}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-primary text-white font-semibold shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
      >
        Login
      </button>
    </form>
  );
}
