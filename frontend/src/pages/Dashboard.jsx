import { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
      showPopup("Error fetching data", "error");
      console.error(err);
    }
    setLoading(false);
  };

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  // --- Expenses CRUD ---
  const handleAddExpense = async () => {
    try {
      await api.post("/expense/new", newExpense, { headers });
      setNewExpense({ amount: "", description: "", type: "one-time", date: "" });
      fetchData();
      showPopup("Expense added", "success");
    } catch (err) {
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
      showPopup(err.response?.data?.error || "Error deleting expense", "error");
    }
  };

  // --- Incomes CRUD ---
  const handleAddIncome = async () => {
    try {
      await api.post("/incomes/new", newIncome, { headers });
      setNewIncome({ amount: "", description: "", date: "" });
      fetchData();
      showPopup("Income added", "success");
    } catch (err) {
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
      showPopup(err.response?.data?.error || "Error deleting income", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  const formatDate = (date) => date ? new Date(date).toLocaleString() : "";

  const pieData = [
    { name: "Expenses", value: summary.totalExpenses },
    { name: "Incomes", value: summary.totalIncome },
  ];
  const COLORS = ["#f87171", "#34d399"];

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {popup.message && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${popup.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {popup.message}
        </div>
      )}

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
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
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

      {/* Add Expense */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Add Expense</h2>
        <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} className="border p-2 rounded mr-2" />
        <input type="text" placeholder="Description" value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} className="border p-2 rounded mr-2" />
        <select value={newExpense.type} onChange={e => setNewExpense({ ...newExpense, type: e.target.value })} className="border p-2 rounded mr-2">
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        <input type="datetime-local" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} className="border p-2 rounded mr-2" />
        <button onClick={handleAddExpense} className="bg-red-500 text-white p-2 rounded">Add Expense</button>
      </div>

      {/* Expenses List */}
      <ul className="mb-8">
        {expenses.map(e => (
          <li key={e.id} className="flex justify-between p-2 border-b">
            <span>${e.amount} - {e.description} - {e.type} ({formatDate(e.date)})</span>
            <div>
              <button onClick={() => setEditingExpense({ ...e })} className="text-yellow-600 mr-2">Edit</button>
              <button onClick={() => handleDeleteExpense(e.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add Income */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Add Income</h2>
        <input type="number" placeholder="Amount" value={newIncome.amount} onChange={e => setNewIncome({ ...newIncome, amount: e.target.value })} className="border p-2 rounded mr-2" />
        <input type="text" placeholder="Description" value={newIncome.description} onChange={e => setNewIncome({ ...newIncome, description: e.target.value })} className="border p-2 rounded mr-2" />
        <input type="datetime-local" value={newIncome.date} onChange={e => setNewIncome({ ...newIncome, date: e.target.value })} className="border p-2 rounded mr-2" />
        <button onClick={handleAddIncome} className="bg-green-500 text-white p-2 rounded">Add Income</button>
      </div>

      {/* Incomes List */}
      <ul className="mb-8">
        {incomes.map(i => (
          <li key={i.id} className="flex justify-between p-2 border-b">
            <span>${i.amount} - {i.description} ({formatDate(i.date)})</span>
            <div>
              <button onClick={() => setEditingIncome({ ...i })} className="text-yellow-600 mr-2">Edit</button>
              <button onClick={() => handleDeleteIncome(i.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modals */}
      {editingExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="font-bold mb-2">Edit Expense</h3>
            <input type="number" value={editingExpense.amount} onChange={e => setEditingExpense({ ...editingExpense, amount: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <input type="text" value={editingExpense.description} onChange={e => setEditingExpense({ ...editingExpense, description: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <select value={editingExpense.type} onChange={e => setEditingExpense({ ...editingExpense, type: e.target.value })} className="border p-2 rounded mb-2 w-full">
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
            <input type="datetime-local" value={editingExpense.date} onChange={e => setEditingExpense({ ...editingExpense, date: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingExpense(null)} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
              <button onClick={handleUpdateExpense} className="bg-green-500 text-white p-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {editingIncome && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="font-bold mb-2">Edit Income</h3>
            <input type="number" value={editingIncome.amount} onChange={e => setEditingIncome({ ...editingIncome, amount: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <input type="text" value={editingIncome.description} onChange={e => setEditingIncome({ ...editingIncome, description: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <input type="datetime-local" value={editingIncome.date} onChange={e => setEditingIncome({ ...editingIncome, date: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingIncome(null)} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
              <button onClick={handleUpdateIncome} className="bg-green-500 text-white p-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}