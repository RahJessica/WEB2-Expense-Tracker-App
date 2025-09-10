import React, { useEffect, useState } from 'react';
import api from "../services/api";

const IncomeList = ({ token }) => {
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({ amount: "", description: "", date: "" });
  const [editingIncome, setEditingIncome] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const headers = { Authorization: `Bearer ${token}` };

  // Format date and time 
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

  // --- Incomes CRUD ---
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

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Income Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ---- Add Income ---- */}
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
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddIncome}
          >
            Add Income
          </button>
        </div>
      </div>

      {/* ---- Income List ---- */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Date & Time</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map(inc => (
              <tr key={inc.id} className="border-b hover:bg-indigo-50 transition">
                <td className="py-3 px-6">{inc.description}</td>
                <td className="py-3 px-6">{inc.amount}</td>
                <td className="py-3 px-6">{formatDateTime(inc.date)}</td>
                <td className="py-3 px-6 space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm"
                    onClick={() => setEditingIncome(inc)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md text-sm"
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

      {/* ---- Edit Income Modal ---- */}
      {editingIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="font-semibold mb-4">Edit Income</h2>
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2"
              value={editingIncome.amount}
              onChange={(e) => setEditingIncome({ ...editingIncome, amount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={editingIncome.description}
              onChange={(e) => setEditingIncome({ ...editingIncome, description: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={editingIncome.date}
              onChange={(e) => setEditingIncome({ ...editingIncome, date: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setEditingIncome(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateIncome}
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

export default IncomeList;