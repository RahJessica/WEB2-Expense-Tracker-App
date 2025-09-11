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

  if (loading) return <p className="ml-64 p-6 text-gray-500 text-lg">Loading...</p>;

  const pieData = [
    { name: "Expenses", value: summary.totalExpenses },
    { name: "Incomes", value: summary.totalIncome },
  ];
  const COLORS = ["#f87171", "#34d399"];

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Navbar />
      <div className="ml-64 flex-1 p-8 w-full max-w-full">
        {popup.message && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-opacity duration-300 ${
              popup.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {popup.message}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <p className="text-2xl font-semibold text-green-600 mt-2">{summary.totalIncome} Ar</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-semibold text-red-600 mt-2">{summary.totalExpenses} Ar</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Balance</h3>
            <p className="text-2xl font-semibold text-blue-600 mt-2">{summary.balance} Ar</p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100 w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Overview</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}