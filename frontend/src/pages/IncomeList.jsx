import React, { useEffect, useState } from 'react';
import api from "../services/api";

const IncomeList = ({ token }) => {
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({ amount: "", description: "", date: "" });
  const [editingIncome, setEditingIncome] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [showAddForm, setShowAddForm] = useState(false);

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

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await api.get('/incomes/incomes', { headers });
      setIncomes(res.data);
    } catch (err) {
      console.error('Error fetching incomes:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      showPopup(err.response?.data?.error || "Failed to fetch incomes", "error");
    }
  };

  const handleAddIncome = async () => {
    if (!newIncome.amount || Number(newIncome.amount) <= 0) {
      showPopup("Amount is required and must be greater than 0", "error");
      return;
    }
    if (!newIncome.description || newIncome.description.trim() === "") {
      showPopup("Description is required", "error");
      return;
    }
    if (!newIncome.date) {
      showPopup("Date is required", "error");
      return;
    }

    try {
      await api.post(
        "/incomes/new",
        { ...newIncome, amount: Number(newIncome.amount) },
        { headers }
      );
      setNewIncome({ amount: "", description: "", date: "" });
      fetchIncomes();
      setShowAddForm(false);
      showPopup("Income added successfully!", "success");
    } catch (err) {
      console.error("POST /incomes/new ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to add income", "error");
    }
  };

  const handleUpdateIncome = async () => {
    if (!editingIncome) return;
    if (!editingIncome.amount || Number(editingIncome.amount) <= 0) {
      showPopup("Amount is required and must be greater than 0", "error");
      return;
    }
    if (!editingIncome.description || editingIncome.description.trim() === "") {
      showPopup("Description is required", "error");
      return;
    }
    if (!editingIncome.date) {
      showPopup("Date is required", "error");
      return;
    }
    try {
      await api.put(`/incomes/${editingIncome.id}`, editingIncome, { headers });
      setEditingIncome(null);
      fetchIncomes();
      showPopup("Income updated successfully", "success");
    } catch (err) {
      console.error("PUT /incomes/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to update income", "error");
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!confirm("Delete this income?")) return;
    try {
      await api.delete(`/incomes/delete/${id}`, { headers });
      fetchIncomes();
      showPopup("Income deleted successfully", "success");
    } catch (err) {
      console.error("DELETE /incomes/delete/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Failed to delete income", "error");
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

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Income Management</h2>

        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            + Add Income
          </button>
        </div>

        <div className={`transition duration-300 ${showAddForm || editingIncome ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium">Description</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Amount</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Date & Time</th>
                  <th className="py-4 px-6 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incomes.map((inc, index) => (
                  <tr
                    key={inc.id}
                    className={`transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50`}
                  >
                    <td className="py-4 px-6 text-gray-700">{inc.description}</td>
                    <td className="py-4 px-6 text-gray-700">{inc.amount}</td>
                    <td className="py-4 px-6 text-gray-700">{formatDateTime(inc.date)}</td>
                    <td className="py-4 px-6 space-x-3">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => setEditingIncome(inc)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => handleDeleteIncome(inc.id)}
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
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Income</h2>
              <input
                type="number"
                placeholder="Amount"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
              />
              <input
                type="date"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={newIncome.date}
                onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
              />
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={handleAddIncome}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {editingIncome && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Income</h2>
              <input
                type="number"
                placeholder="Amount"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editingIncome.amount}
                onChange={(e) => setEditingIncome({ ...editingIncome, amount: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editingIncome.description}
                onChange={(e) => setEditingIncome({ ...editingIncome, description: e.target.value })}
              />
              <input
                type="date"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editingIncome.date}
                onChange={(e) => setEditingIncome({ ...editingIncome, date: e.target.value })}
              />
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={() => setEditingIncome(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  onClick={handleUpdateIncome}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;