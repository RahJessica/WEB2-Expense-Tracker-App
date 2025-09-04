import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({ amount: "", type: "one-time", date: "" });
  const [newIncome, setNewIncome] = useState({ amount: "", description: "", date: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, expensesRes, incomesRes] = await Promise.all([
        api.get("/dashboard", { headers }),
        api.get("/expense", { headers }),
        api.get("/incomes", { headers }),
      ]);
      setSummary(summaryRes.data);
      setExpenses(expensesRes.data);
      setIncomes(incomesRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // --- Expenses CRUD ---
  const handleAddExpense = async () => {
    try {
      await api.post("/expense/new", newExpense, { headers });
      setNewExpense({ amount: "", type: "one-time", date: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expense/delete/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting expense");
    }
  };

  const handleUpdateExpense = async (id) => {
    const amount = prompt("Enter new amount:");
    if (!amount) return;
    try {
      await api.put(`/expense/edit/${id}`, { amount }, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating expense");
    }
  };

  // --- Incomes CRUD ---
  const handleAddIncome = async () => {
    try {
      await api.post("/incomes/new", newIncome, { headers });
      setNewIncome({ amount: "", description: "", date: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding income");
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!confirm("Delete this income?")) return;
    try {
      await api.delete(`/incomes/delete/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting income");
    }
  };

  const handleUpdateIncome = async (id) => {
    const amount = prompt("Enter new amount:");
    if (!amount) return;
    try {
      await api.put(`/incomes/${id}`, { amount }, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating income");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded bg-green-100">
          <h2>Total Income</h2>
          <p className="text-xl font-bold">${summary.totalIncome}</p>
        </div>
        <div className="p-4 border rounded bg-red-100">
          <h2>Total Expenses</h2>
          <p className="text-xl font-bold">${summary.totalExpenses}</p>
        </div>
        <div className="p-4 border rounded bg-blue-100">
          <h2>Balance</h2>
          <p className="text-xl font-bold">${summary.balance}</p>
        </div>
      </div>

      {/* Add Expense */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Add Expense</h2>
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <select
          value={newExpense.type}
          onChange={e => setNewExpense({ ...newExpense, type: e.target.value })}
          className="border p-2 rounded mr-2"
        >
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        <input
          type="date"
          value={newExpense.date}
          onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleAddExpense} className="bg-red-500 text-white p-2 rounded">
          Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <ul className="mb-8">
        {expenses.map(e => (
          <li key={e.id} className="flex justify-between p-2 border-b">
            <span>${e.amount} - {e.type} {e.date ? `(${e.date})` : ""}</span>
            <div>
              <button onClick={() => handleUpdateExpense(e.id)} className="text-yellow-600 mr-2">Edit</button>
              <button onClick={() => handleDeleteExpense(e.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add Income */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Add Income</h2>
        <input
          type="number"
          placeholder="Amount"
          value={newIncome.amount}
          onChange={e => setNewIncome({ ...newIncome, amount: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newIncome.description}
          onChange={e => setNewIncome({ ...newIncome, description: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="date"
          value={newIncome.date}
          onChange={e => setNewIncome({ ...newIncome, date: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleAddIncome} className="bg-green-500 text-white p-2 rounded">
          Add Income
        </button>
      </div>

      {/* Incomes List */}
      <ul className="mb-8">
        {incomes.map(i => (
          <li key={i.id} className="flex justify-between p-2 border-b">
            <span>${i.amount} - {i.description} {i.date ? `(${i.date})` : ""}</span>
            <div>
              <button onClick={() => handleUpdateIncome(i.id)} className="text-yellow-600 mr-2">Edit</button>
              <button onClick={() => handleDeleteIncome(i.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}