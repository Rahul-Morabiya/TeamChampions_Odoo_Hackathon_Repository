"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div>
        <label className="block mb-1 font-medium text-primary" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/80 transition"
        />
      </div>
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
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/80 transition"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-primary" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/80 transition"
        >
          <option value="employee">Employee</option>
          <option value="approver">Approver</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <div className="text-red-600 text-sm text-center animate-shake">{error}</div>}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-primary text-white font-semibold shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
      >
        Sign Up
      </button>
    </form>
  );
}
