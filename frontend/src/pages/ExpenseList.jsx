// ExpenseList.js
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
  const [showAddForm, setShowAddForm] = useState(false); // 👈 Bouton + Form

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
    hours = hours % 12 || 12;
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const validateExpense = (expense) => {
    if (!expense.amount || Number(expense.amount) <= 0)
      return "Amount is required and must be > 0";
    if (!expense.description || expense.description.trim() === "")
      return "Description is required";
    if (expense.type === "one-time" && !expense.date)
      return "Date is required for a one-time expense";
    if (expense.type === "recurring" && !expense.startDate)
      return "Start date is required for a recurring expense";
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
      console.error('Error fetching receipts:', err?.response?.data || err.message);
      showPopup("Failed to fetch receipts", "error");
    }
  };

  const handleFileUpload = async (e, expenseId) => {
    const file = e.target.files[0];
    if (!file) return;

    //setUploading(prev => ({ ...prev, [expenseId]: true }));

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
     // showPopup('Receipt uploaded successfully!', "success");
    } catch (err) {
      console.error('Error uploading receipt:', err.message);  // mettre ? apres err
     // showPopup(err.message, "error");
    } //finally {
     // setUploading(prev => ({ ...prev, [expenseId]: false }));
    //}
  };

  const handleAddExpense = async () => {
    const error = validateExpense(newExpense);
    if (error) {
      showPopup(error, "error");
      return;
    }

    const payload =
      newExpense.type === "one-time"
        ? {
            amount: Number(newExpense.amount),
            description: newExpense.description,
            type: "one-time",
            date: newExpense.date,
          }
        : {
            amount: Number(newExpense.amount),
            description: newExpense.description,
            type: "recurring",
            startDate: newExpense.startDate,
            endDate: newExpense.endDate || null,
          };

    try {
      await api.post("/expense/new", payload, { headers });
      setNewExpense({
        amount: "",
        description: "",
        type: "one-time",
        date: "",
        startDate: "",
        endDate: "",
      });
      fetchExpenses();
      setShowAddForm(false); // 👈 Cache le formulaire après ajout
      showPopup("Expense added successfully!", "success");
    } catch (err) {
      console.error("POST /expense/new ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to add expense", "error");
    }
  };

  const openEditModal = (expense) => {
    setEditingExpense({
       ...expense,
       date: expense.date || "",
       startDate: expense.startDate || "",
       endDate: expense.endDate || ""
    });
  };

  const handleUpdateExpense = async () => {
  if (!editingExpense) return;

  const error = validateExpense(editingExpense);
  if (error) {
    showPopup(error, "error");
    return;
  }

  const payload =
    editingExpense.type === "one-time"
      ? {
          amount: Number(editingExpense.amount),
          description: editingExpense.description,
          type: "one-time",
          date: editingExpense.date,
        }
      : {
          amount: Number(editingExpense.amount),
          description: editingExpense.description,
          type: "recurring",
          startDate: editingExpense.startDate,
          endDate: editingExpense.endDate || null,
        };

  try {
    await api.put(`/expense/${editingExpense.id}`, payload, { headers });
    fetchExpenses();
    setEditingExpense(null); // ferme la modale
    showPopup("Expense updated successfully!", "success");
  } catch (err) {
    console.error("PUT /expense/:id ->", err?.response?.data || err.message);
    showPopup(err.response?.data?.error || "Failed to update expense", "error");
  }
};


  const handleDeleteExpense = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
  if (!confirmDelete) return;

  try {
    await api.delete(`/expense/${id}`, { headers });
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      showPopup("Expense deleted successfully!", "success");
    } catch (err) {
      console.error("DELETE /expense/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to delete expense", "error");
    }
  };

  return (
    <div className="p-6 ml-64 bg-gray-100 min-h-screen relative">
      {popup.message && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white z-50 ${
          popup.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {popup.message}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Expense Management</h2>

      {/* Bouton pour afficher le formulaire */}
      <div className="mb-6 flex justify-center it">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          + Ajouter 
        </button>
      </div>

      {/* Liste des dépenses floutée si le formulaire est affiché */}
      <div className={`transition duration-300 ${showAddForm ? 'blur-sm pointer-events-none select-none' : ''}`}>
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
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-indigo-50 transition">
                <td className="py-3 px-6">{exp.description}</td>
                <td className="py-3 px-6">{exp.amount}</td>
                <td className="py-3 px-6">{formatDateTime(exp.date || exp.startDate)}</td>
                <td className="py-3 px-6">
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
                  {receipts
                    .filter((r) => r.expenseId === exp.id)
                    .map((r) => (
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
                    onClick={() => openEditModal(exp)}
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

      {/* Formulaire en overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md animate-fade-in">
            <h2 className="font-semibold mb-4 text-lg">Ajouter une dépense</h2>
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
                <input
                  type="date"
                  placeholder="Start Date"
                  className="border p-2 w-full mb-2"
                  value={newExpense.startDate}
                  onChange={(e) => setNewExpense({ ...newExpense, startDate: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="End Date (optional)"
                  className="border p-2 w-full mb-2"
                  value={newExpense.endDate}
                  onChange={(e) => setNewExpense({ ...newExpense, endDate: e.target.value })}
                />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowAddForm(false)}
              >
                Annuler
              </button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={handleAddExpense}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de modification si besoin */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="font-semibold mb-4">Modifier la dépense</h2>
            <input
              type="number"
              className="border p-2 w-full mb-2"
              value={editingExpense.amount}
              onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
            />
            <input
              type="text"
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
                <input
                  type="date"
                  className="border p-2 w-full mb-2"
                  value={editingExpense.startDate}
                  onChange={(e) => setEditingExpense({ ...editingExpense, startDate: e.target.value })}
                />
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
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateExpense}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
