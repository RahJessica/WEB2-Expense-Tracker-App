import { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({ amount: "", description: "", type: "one-time", date: "" });
  const [newIncome, setNewIncome] = useState({ amount: "", description: "", date: "" });
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

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
        api.get("/dashboard", { headers })          
      ]);

      if (expRes.status === "fulfilled") {
        setExpenses(expRes.value.data);
      } else {
        console.error("GET /expense/expenses ->", expRes.reason?.response?.status, expRes.reason?.config?.url, expRes.reason?.response?.data || expRes.reason?.message);
        showPopup("Erreur de récupération des dépenses", "error");
      }

      if (incRes.status === "fulfilled") {
        setIncomes(incRes.value.data);
      } else {
        console.error("GET /incomes/incomes ->", incRes.reason?.response?.status, incRes.reason?.config?.url, incRes.reason?.response?.data || incRes.reason?.message);
        showPopup("Erreur de récupération des revenus", "error");
      }

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
          balance: totalIncome - totalExpenses
        });
      }
    } catch (err) {
      console.error("fetchData error ->", err?.response?.status, err?.config?.url, err?.response?.data || err?.message);
      showPopup("Erreur réseau", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Expenses CRUD ---
  const handleAddExpense = async () => {
    try {
      await api.post("/expense/new", { ...newExpense, amount: Number(newExpense.amount) || 0 }, { headers });
      setNewExpense({ amount: "", description: "", type: "one-time", date: "" });
      fetchData();
      showPopup("Expense added", "success");
    } catch (err) {
      console.error("POST /expense/new ->", err?.response?.status, err?.response?.data || err?.message);
      showPopup(err.response?.data?.error || "Error adding expense", "error");
    }
  };

  const handleUpdateExpense = async () => {
    try {
      await api.put(`/expense/edit/${editingExpense.id}`, editingExpense, { headers });
      setEditingExpense(null);
      fetchData();
      showPopup("Expense updated", "success");
    } catch (err) {
      console.error("PUT /expense/edit/:id ->", err?.response?.status, err?.response?.data || err?.message);
      showPopup(err.response?.data?.error || "Error updating expense", "error");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expense/delete/${id}`, { headers });
      fetchData();
      showPopup("Expense deleted", "success");
    } catch (err) {
      console.error("DELETE /expense/delete/:id ->", err?.response?.status, err?.response?.data || err?.message);
      showPopup(err.response?.data?.error || "Error deleting expense", "error");
    }
  };

  // --- Incomes CRUD ---
  const handleAddIncome = async () => {
    try {
      await api.post("/incomes/new", { ...newIncome, amount: Number(newIncome.amount) || 0 }, { headers });
      setNewIncome({ amount: "", description: "", date: "" });
      fetchData();
      showPopup("Income added", "success");
    } catch (err) {
      console.error("POST /incomes/new ->", err?.response?.status, err?.response?.data || err?.message);
      showPopup(err.response?.data?.error || "Error adding income", "error");
    }
  };

  const handleUpdateIncome = async () => {
    try {
      await api.put(`/incomes/${editingIncome.id}`, editingIncome, { headers });
      setEditingIncome(null);
      fetchData();
      showPopup("Income updated", "success");
    } catch (err) {
      console.error("PUT /incomes/:id ->", err?.response?.status, err?.response?.data || err?.message);
      showPopup(err.response?.data?.error || "Error updating income", "error");
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!confirm("Delete this income?")) return;
    try {
      await api.delete(`/incomes/delete/${id}`, { headers });
      fetchData();
      showPopup("Income deleted", "success");
    } catch (err) {
      console.error("DELETE /incomes/delete/:id ->", err?.response?.status, err?.response?.data || err?.message);
      showPopup(err.response?.data?.error || "Error deleting income", "error");
    }
  };

  if (loading) return <p className="ml-64 p-6">Loading...</p>;

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "");
  const pieData = [
    { name: "Expenses", value: summary.totalExpenses },
    { name: "Incomes", value: summary.totalIncome }
  ];
  const COLORS = ["#f87171", "#34d399"];

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 flex-1 p-6">
        {popup.message && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${popup.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {popup.message}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-100 p-4 rounded shadow">Total Income: {summary.totalIncome} Ar</div>
          <div className="bg-red-100 p-4 rounded shadow">Total Expenses: {summary.totalExpenses} Ar</div>
          <div className="bg-blue-100 p-4 rounded shadow">Balance: {summary.balance} Ar</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-4">Add Expense</h2>
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            />
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleAddExpense}>
              Add Expense
            </button>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-4">Add Income</h2>
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={newIncome.description}
              onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddIncome}>
              Add Income
            </button>
          </div>
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