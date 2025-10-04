"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function ApproverDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/expenses?status=pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch(() => setError("Failed to load expenses"));
  }, []);

  return (
    <DashboardLayout title="Pending Expenses">
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100 text-primary">
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="hover:bg-blue-50 transition">
                <td className="py-2 px-3">{exp.title}</td>
                <td className="py-2 px-3">₹{exp.amount}</td>
                <td className="py-2 px-3">{exp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
