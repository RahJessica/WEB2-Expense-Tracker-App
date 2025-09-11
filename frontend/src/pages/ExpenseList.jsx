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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // State for delete confirmation

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
    } catch (err) {
      console.error('Error uploading receipt:', err?.message);
    }
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
      setShowAddForm(false);
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

    const payload =
      editingExpense.type === "one-time"
        ? {
            amount: Number(editingExpense.amount),
            description: editingExpense.description,
            type: "one-time",
            date: editingExpense.date || new Date().toISOString().split("T")[0],
          }
        : {
            amount: Number(editingExpense.amount),
            description: editingExpense.description,
            type: "recurring",
            startDate: editingExpense.startDate,
            endDate: editingExpense.endDate || null,
          };

    try {
      await api.put(`/expense/edit/${editingExpense.id}`, payload, { headers });
      setEditingExpense(null);
      fetchExpenses();
      showPopup("Dépense mise à jour avec succès", "success");
    } catch (err) {
      console.error("PUT /expense/edit/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Erreur lors de la mise à jour", "error");
    }
  };

  const handleDeleteExpense = (id) => {
    setShowDeleteConfirm(id); // Show confirmation modal with expense ID
  };

  const confirmDelete = async (id) => {
    try {
      await api.delete(`/expense/delete/${id}`, { headers });
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      showPopup("Dépense supprimée avec succès", "success");
    } catch (err) {
      console.error("DELETE /expense/delete/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Erreur lors de la suppression", "error");
    } finally {
      setShowDeleteConfirm(null); // Close modal
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full max-w-full">
      <div className="ml-64 flex-1 p-8 w-full">
        {popup.message && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-opacity duration-300 z-50 ${
              popup.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {popup.message}
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Expense Management</h2>

        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            + Add Expense
          </button>
        </div>

        <div className={`transition duration-300 ${showAddForm || editingExpense || showDeleteConfirm ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium">Description</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Amount</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Date & Time</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Receipt</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((exp, index) => (
                  <tr
                    key={exp.id}
                    className={`transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50`}
                  >
                    <td className="py-4 px-6 text-gray-700">{exp.description}</td>
                    <td className="py-4 px-6 text-gray-700">{exp.amount}</td>
                    <td className="py-4 px-6 text-gray-700">{formatDateTime(exp.date || exp.startDate)}</td>
                    <td className="py-4 px-6">
                      <label className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200">
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
                          <div key={r.id} className="mt-2">
                            <a
                              href={`http://localhost:8080/uploads/${r.fileURL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              View Receipt
                            </a>
                          </div>
                        ))}
                    </td>
                    <td className="py-4 px-6 space-x-3">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => setEditingExpense(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
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
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Expense</h2>
              <input
                type="number"
                placeholder="Amount"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
              <select
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                  className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              )}
              {newExpense.type === "recurring" && (
                <>
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={newExpense.startDate}
                    onChange={(e) => setNewExpense({ ...newExpense, startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    placeholder="End Date (optional)"
                    className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={newExpense.endDate}
                    onChange={(e) => setNewExpense({ ...newExpense, endDate: e.target.value })}
                  />
                </>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={handleAddExpense}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {editingExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Expense</h2>
              <input
                type="number"
                placeholder="Amount"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editingExpense.amount || ""}
                onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editingExpense.description || ""}
                onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
              />
              <select
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editingExpense.type || "one-time"}
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
                  placeholder="Date"
                  className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={editingExpense.date || ""}
                  onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                />
              )}
              {editingExpense.type === "recurring" && (
                <>
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={editingExpense.startDate || ""}
                    onChange={(e) => setEditingExpense({ ...editingExpense, startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    placeholder="End Date (optional)"
                    className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={editingExpense.endDate || ""}
                    onChange={(e) => setEditingExpense({ ...editingExpense, endDate: e.target.value })}
                  />
                </>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={handleUpdateExpense}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Confirmer la suppression</h2>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette dépense ?</p>
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Annuler
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={() => confirmDelete(showDeleteConfirm)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;