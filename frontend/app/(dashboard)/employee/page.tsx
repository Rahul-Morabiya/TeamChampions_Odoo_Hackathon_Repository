"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function EmployeeDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch expenses
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/expenses/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch(() => setError("Failed to load your expenses"));
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit expense");
      }
      const newExpense = await res.json();
      setExpenses([newExpense, ...expenses]);
      setForm({ amount: "", category: "", date: "", description: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Expenses">
      <div className="mb-8" style={{color: "black"}}>
        <h2 className="text-xl font-semibold mb-2">Submit Expense</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block mb-1 font-medium" htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Food">Food</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-primary/90"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </div>
      <div className="overflow-x-auto" style={{color: "black"}}>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100 text-primary">
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp: any) => (
              <tr key={exp._id} className="hover:bg-blue-50 transition">
                <td className="py-2 px-3">{exp.amount}</td>
                <td className="py-2 px-3">{exp.category}</td>
                <td className="py-2 px-3">{exp.date ? new Date(exp.date).toLocaleDateString() : ""}</td>
                <td className="py-2 px-3">{exp.description}</td>
                <td className="py-2 px-3">{exp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}