


import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    type: "one-time",
    date: "",
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/expense", { headers });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      showPopup("Error fetching expenses", "error");
      console.error(err);
    }
    setLoading(false);
  };

  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const handleAddExpense = async () => {
    try {
      await fetch("http://localhost:8080/expense/new", {
        method: "POST",
        headers,
        body: JSON.stringify(newExpense),
      });
      setNewExpense({ amount: "", description: "", type: "one-time", date: "" });
      fetchExpenses();
      showPopup("Expense added", "success");
    } catch (err) {
      showPopup("Error adding expense", "error");
    }
  };

  const handleUpdateExpense = async () => {
    try {
      await fetch(`http://localhost:8080/expense/edit/${editingExpense.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editingExpense),
      });
      setEditingExpense(null);
      fetchExpenses();
      showPopup("Expense updated", "success");
    } catch (err) {
      showPopup("Error updating expense", "error");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await fetch(`http://localhost:8080/expense/delete/${id}`, {
        method: "DELETE",
        headers,
      });
      fetchExpenses();
      showPopup("Expense deleted", "success");
    } catch (err) {
      showPopup("Error deleting expense", "error");
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Navbar />

      <div className="ml-64 flex-1 p-6">
        {/* Popup */}
        {popup.message && (
          <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${
              popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popup.message}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-5">Expenses</h1>

        {/* Add Expense */}
        <div className="mb-6">
          <h2 className="font-bold mb-2">Add Expense</h2>
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <select
            value={newExpense.type}
            onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
            className="border p-2 rounded mr-2"
          >
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
          <input
            type="datetime-local"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <button onClick={handleAddExpense} className="bg-red-500 text-white p-2 rounded">
            Add Expense
          </button>
        </div>

        {/* Expenses List */}
        <ul className="mb-8">
          {expenses.map((e) => (
            <li key={e.id} className="flex justify-between p-2 border-b">
              <span>
                ${e.amount} - {e.description} - {e.type} ({formatDate(e.date)})
              </span>
              <div>
                <button
                  onClick={() => setEditingExpense({ ...e })}
                  className="text-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteExpense(e.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Edit Expense Modal */}
        {editingExpense && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="font-bold mb-2">Edit Expense</h3>
              <input
                type="number"
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, amount: e.target.value })
                }
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="text"
                value={editingExpense.description}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, description: e.target.value })
                }
                className="border p-2 rounded mb-2 w-full"
              />
              <select
                value={editingExpense.type}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, type: e.target.value })
                }
                className="border p-2 rounded mb-2 w-full"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
              <input
                type="datetime-local"
                value={editingExpense.date}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, date: e.target.value })
                }
                className="border p-2 rounded mb-2 w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingExpense(null)}
                  className="bg-gray-400 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateExpense}
                  className="bg-green-500 text-white p-2 rounded"
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
}
