import { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const sumAmounts = (arr) => arr.reduce((s, x) => s + (Number(x.amount) || 0), 0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, incRes, sumRes] = await Promise.allSettled([
        api.get("/expense/expenses", { headers }),
        api.get("/incomes/incomes", { headers }),
        api.get("/dashboard", { headers }),
      ]);

      if (sumRes.status === "fulfilled") {
        setSummary(sumRes.value.data);
      } else {
        const exp = expRes.status === "fulfilled" ? expRes.value.data : [];
        const inc = incRes.status === "fulfilled" ? incRes.value.data : [];
        const totalExpenses = sumAmounts(exp);
        const totalIncome = sumAmounts(inc);
        setSummary({
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        });
      }
    } catch (err) {
      console.error("fetchData error ->", err);
      showPopup("Erreur réseau", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="ml-64 p-6">Loading...</p>;

  const pieData = [
    { name: "Expenses", value: summary.totalExpenses },
    { name: "Incomes", value: summary.totalIncome },
  ];
  const COLORS = ["#f87171", "#34d399"];

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 flex-1 p-6">
        {popup.message && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${
              popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popup.message}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-100 p-4 rounded shadow">Total Income: {summary.totalIncome} Ar</div>
          <div className="bg-red-100 p-4 rounded shadow">Total Expenses: {summary.totalExpenses} Ar</div>
          <div className="bg-blue-100 p-4 rounded shadow">Balance: {summary.balance} Ar</div>
        </div>

        <div className="bg-white shadow rounded p-6 mt-6">
          <h2 className="font-semibold mb-4">Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}