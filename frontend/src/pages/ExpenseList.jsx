import React, { useEffect, useState } from 'react';
import api from "../services/api";

const ExpenseList = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [uploading, setUploading] = useState({});
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    type: "one-time",
    date: "",
    startDate: "",
    endDate: "",
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const headers = { Authorization: `Bearer ${token}` };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; 
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const validateExpense = (expense) => {
    if (!expense.amount || Number(expense.amount) <= 0) return "Amount is required and must be > 0";
    if (!expense.description || expense.description.trim() === "") return "Description is required";
    if (expense.type === "one-time" && !expense.date) return "Date is required for a one-time expense";
    if (expense.type === "recurring" && !expense.startDate) return "Start date is required for a recurring expense";
    return null;
  };

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchExpenses();
    fetchReceipts();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expense/expenses', { headers });
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err?.response?.data || err.message);
      showPopup("Failed to fetch expenses", "error");
    }
  };

  const fetchReceipts = async () => {
    try {
      const res = await api.get('/receipts', { headers });
      setReceipts(res.data);
    } catch (err) {
      console.error('Error fetching receipts:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      showPopup(err.response?.data?.error || "Failed to fetch receipts", "error");
    }
  };

  const handleFileUpload = async (e, expenseId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [expenseId]: true }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('expenseId', expenseId);

    try {
      const res = await fetch('http://localhost:8080/receipts/new', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Failed to upload receipt');

      const data = await res.json();
      setReceipts(prev => [data, ...prev]);
      showPopup('Receipt uploaded successfully!', "success");
    } catch (err) {
      console.error('Error uploading receipt:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      showPopup(err.message, "error");
    } finally {
      setUploading(prev => ({ ...prev, [expenseId]: false }));
    }
  };

  // --- Expenses CRUD ---
  const handleAddExpense = async () => {
    const error = validateExpense(newExpense);
    if (error) {
      showPopup(error, "error");
      return;
    }

    const payload =
      newExpense.type === "one-time"
        ? { amount: Number(newExpense.amount), description: newExpense.description, type: "one-time", date: newExpense.date }
        : { amount: Number(newExpense.amount), description: newExpense.description, type: "recurring", startDate: newExpense.startDate, endDate: newExpense.endDate || null };

    try {
      await api.post("/expense/new", payload, { headers });
      setNewExpense({ amount: "", description: "", type: "one-time", date: "", startDate: "", endDate: "" });
      fetchExpenses();
      showPopup("Expense added successfully!", "success");
    } catch (err) {
      console.error("POST /expense/new ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to add expense", "error");
    }
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense) return;
    const error = validateExpense(editingExpense);
    if (error) {
      showPopup(error, "error");
      return;
    }
    try {
      await api.put(`/expense/edit/${editingExpense.id}`, editingExpense, { headers });
      setEditingExpense(null);
      fetchExpenses();
      showPopup("Expense updated successfully", "success");
    } catch (err) {
      console.error("PUT /expense/edit/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to update expense", "error");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expense/delete/${id}`, { headers });
      fetchExpenses();
      showPopup("Expense deleted successfully", "success");
    } catch (err) {
      console.error("DELETE /expense/delete/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to delete expense", "error");
    }
  };

  return (
    <div className="p-6 ml-64 bg-gray-100 min-h-screen">
      {popup.message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${
            popup.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popup.message}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Expense Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ---- Add Expense ---- */}
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
          <select
            className="border p-2 w-full mb-2"
            value={newExpense.type}
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                type: e.target.value,
                date: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
          {newExpense.type === "one-time" && (
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            />
          )}
          {newExpense.type === "recurring" && (
            <>
              <label className="block text-sm mb-1">Start Date (required)</label>
              <input
                type="date"
                className="border p-2 w-full mb-2"
                value={newExpense.startDate}
                onChange={(e) => setNewExpense({ ...newExpense, startDate: e.target.value })}
              />
              <label className="block text-sm mb-1">End Date (optional)</label>
              <input
                type="date"
                className="border p-2 w-full mb-2"
                value={newExpense.endDate}
                onChange={(e) => setNewExpense({ ...newExpense, endDate: e.target.value })}
              />
            </>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleAddExpense}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* ---- Expense List ---- */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Date & Time</th>
              <th className="py-3 px-6 text-left">Receipt</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="border-b hover:bg-indigo-50 transition">
                <td className="py-3 px-6">{exp.description || exp.name}</td>
                <td className="py-3 px-6">{exp.amount}</td>
                <td className="py-3 px-6">{formatDateTime(exp.date || exp.startDate)}</td>
                <td className="py-3 px-6 space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm">
                      {uploading[exp.id] ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileUpload(e, exp.id)}
                        disabled={uploading[exp.id]}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {receipts
                    .filter(r => r.expenseId === exp.id)
                    .map(r => (
                      <div key={r.id}>
                        <a
                          href={`http://localhost:8080/${r.fileURL}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 underline text-sm"
                        >
                          View Receipt
                        </a>
                      </div>
                    ))}
                </td>
                <td className="py-3 px-6 space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm"
                    onClick={() => setEditingExpense(exp)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md text-sm"
                    onClick={() => handleDeleteExpense(exp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Edit Expense Modal ---- */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="font-semibold mb-4">Edit Expense</h2>
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2"
              value={editingExpense.amount}
              onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={editingExpense.description}
              onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
            />
            <select
              className="border p-2 w-full mb-2"
              value={editingExpense.type}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  type: e.target.value,
                  date: e.target.value === "one-time" ? editingExpense.date || "" : "",
                  startDate: e.target.value === "recurring" ? editingExpense.startDate || "" : "",
                  endDate: e.target.value === "recurring" ? editingExpense.endDate || "" : "",
                })
              }
            >
              <option value="one-time">One-Time</option>
              <option value="recurring">Recurring</option>
            </select>
            {editingExpense.type === "one-time" && (
              <input
                type="date"
                className="border p-2 w-full mb-2"
                value={editingExpense.date}
                onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
              />
            )}
            {editingExpense.type === "recurring" && (
              <>
                <label className="block text-sm mb-1">Start Date (required)</label>
                <input
                  type="date"
                  className="border p-2 w-full mb-2"
                  value={editingExpense.startDate}
                  onChange={(e) => setEditingExpense({ ...editingExpense, startDate: e.target.value })}
                />
                <label className="block text-sm mb-1">End Date (optional)</label>
                <input
                  type="date"
                  className="border p-2 w-full mb-2"
                  value={editingExpense.endDate}
                  onChange={(e) => setEditingExpense({ ...editingExpense, endDate: e.target.value })}
                />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setEditingExpense(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateExpense}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;