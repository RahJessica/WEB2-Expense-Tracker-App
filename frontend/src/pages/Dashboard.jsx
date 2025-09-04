import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({ amount: "", type: "one-time", date: "" });
  const [newIncome, setNewIncome] = useState({ amount: "", description: "", date: "" });

  const [editItem, setEditItem] = useState(null); 
  const [popup, setPopup] = useState({ message: "", type: "" }); 
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
    }
    setLoading(false);
  };

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const handleAddExpense = async () => {
    try {
      await api.post("/expense/new", newExpense, { headers });
      setNewExpense({ amount: "", type: "one-time", date: "" });
      fetchData();
      showPopup("Expense added successfully!", "success");
    } catch (err) {
      showPopup(err.response?.data?.error || "Error adding expense", "error");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expense/delete/${id}`, { headers });
      fetchData();
      showPopup("Expense deleted successfully!", "success");
    } catch (err) {
      showPopup(err.response?.data?.error || "Error deleting expense", "error");
    }
  };

  const handleAddIncome = async () => {
    try {
      await api.post("/incomes/new", newIncome, { headers });
      setNewIncome({ amount: "", description: "", date: "" });
      fetchData();
      showPopup("Income added successfully!", "success");
    } catch (err) {
      showPopup(err.response?.data?.error || "Error adding income", "error");
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!confirm("Delete this income?")) return;
    try {
      await api.delete(`/incomes/delete/${id}`, { headers });
      fetchData();
      showPopup("Income deleted successfully!", "success");
    } catch (err) {
      showPopup(err.response?.data?.error || "Error deleting income", "error");
    }
  };

  const handleEditClick = (item, type) => {
    setEditItem({ type, data: item });
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      if (editItem.type === "expense") {
        await api.put(`/expense/edit/${editItem.data.id}`, updatedData, { headers });
      } else {
        await api.put(`/incomes/${editItem.data.id}`, updatedData, { headers });
      }
      setEditItem(null);
      fetchData();
      showPopup(`${editItem.type === "expense" ? "Expense" : "Income"} updated successfully!`, "success");
    } catch (err) {
      showPopup(err.response?.data?.error || "Error updating item", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 relative">
      {popup.message && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${popup.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {popup.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>

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

      <div className="mb-6">
        <h2 className="font-bold mb-2">Add Expense</h2>
        <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} className="border p-2 rounded mr-2"/>
        <select value={newExpense.type} onChange={e => setNewExpense({ ...newExpense, type: e.target.value })} className="border p-2 rounded mr-2">
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        <input type="date" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} className="border p-2 rounded mr-2"/>
        <button onClick={handleAddExpense} className="bg-red-500 text-white p-2 rounded">Add Expense</button>
      </div>

      <ul className="mb-8">
        {expenses.map(e => (
          <li key={e.id} className="flex justify-between p-2 border-b">
            <span>${e.amount} - {e.type} {e.date ? `(${e.date})` : ""}</span>
            <div>
              <button onClick={() => handleEditClick(e, "expense")} className="text-yellow-600 mr-2">Edit</button>
              <button onClick={() => handleDeleteExpense(e.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-6">
        <h2 className="font-bold mb-2">Add Income</h2>
        <input type="number" placeholder="Amount" value={newIncome.amount} onChange={e => setNewIncome({ ...newIncome, amount: e.target.value })} className="border p-2 rounded mr-2"/>
        <input type="text" placeholder="Description" value={newIncome.description} onChange={e => setNewIncome({ ...newIncome, description: e.target.value })} className="border p-2 rounded mr-2"/>
        <input type="date" value={newIncome.date} onChange={e => setNewIncome({ ...newIncome, date: e.target.value })} className="border p-2 rounded mr-2"/>
        <button onClick={handleAddIncome} className="bg-green-500 text-white p-2 rounded">Add Income</button>
      </div>

      <ul className="mb-8">
        {incomes.map(i => (
          <li key={i.id} className="flex justify-between p-2 border-b">
            <span>${i.amount} - {i.description} {i.date ? `(${i.date})` : ""}</span>
            <div>
              <button onClick={() => handleEditClick(i, "income")} className="text-yellow-600 mr-2">Edit</button>
              <button onClick={() => handleDeleteIncome(i.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Edit {editItem.type}</h2>
            <input type="number" value={editItem.data.amount} onChange={e => setEditItem({...editItem, data: {...editItem.data, amount: e.target.value}})} className="border p-2 rounded w-full mb-4"/>
            {editItem.type === "expense" && (
              <input type="date" value={editItem.data.date} onChange={e => setEditItem({...editItem, data: {...editItem.data, date: e.target.value}})} className="border p-2 rounded w-full mb-4"/>
            )}
            {editItem.type === "income" && (
              <input type="text" value={editItem.data.description} onChange={e => setEditItem({...editItem, data: {...editItem.data, description: e.target.value}})} className="border p-2 rounded w-full mb-4"/>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditItem(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={() => handleEditSubmit(editItem.data)} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}