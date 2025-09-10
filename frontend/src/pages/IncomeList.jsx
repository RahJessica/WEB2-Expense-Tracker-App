import React, { useEffect, useState } from 'react';
import api from "../services/api";

const IncomeList = ({ token }) => {
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({ amount: "", description: "", date: "" });
  const [editingIncome, setEditingIncome] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const headers = { Authorization: `Bearer ${token}` };

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
      console.error('Erreur fetch incomes:', err);
      showPopup("Erreur de récupération des revenus", "error");
    }
  };

  // --- Incomes CRUD ---
  const handleAddIncome = async () => {
    if (!newIncome.amount || Number(newIncome.amount) <= 0) {
      showPopup("Le montant est requis et doit être supérieur à 0", "error");
      return;
    }
    if (!newIncome.description || newIncome.description.trim() === "") {
      showPopup("La description est requise", "error");
      return;
    }
    if (!newIncome.date) {
      showPopup("La date est requise", "error");
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
      showPopup("Revenu ajouté avec succès !", "success");
    } catch (err) {
      console.error("POST /incomes/new ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Erreur lors de l'ajout du revenu", "error");
    }
  };

  const handleUpdateIncome = async () => {
    if (!editingIncome) return;
    if (!editingIncome.amount || Number(editingIncome.amount) <= 0) {
      showPopup("Le montant est requis et doit être supérieur à 0", "error");
      return;
    }
    if (!editingIncome.description || editingIncome.description.trim() === "") {
      showPopup("La description est requise", "error");
      return;
    }
    if (!editingIncome.date) {
      showPopup("La date est requise", "error");
      return;
    }
    try {
      await api.put(`/incomes/${editingIncome.id}`, editingIncome, { headers });
      setEditingIncome(null);
      fetchIncomes();
      showPopup("Revenu mis à jour", "success");
    } catch (err) {
      console.error("PUT /incomes/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Erreur lors de la mise à jour du revenu", "error");
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!confirm("Supprimer ce revenu ?")) return;
    try {
      await api.delete(`/incomes/delete/${id}`, { headers });
      fetchIncomes();
      showPopup("Revenu supprimé", "success");
    } catch (err) {
      console.error("DELETE /incomes/delete/:id ->", err?.response?.data || err.message);
      showPopup(err.response?.data?.error || "Erreur lors de la suppression du revenu", "error");
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

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Gestion des Revenus</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ---- Add Income ---- */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-4">Ajouter un Revenu</h2>
          <input
            type="number"
            placeholder="Montant"
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
            Ajouter Revenu
          </button>
        </div>
      </div>

      {/*Income List*/}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Montant</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map(inc => (
              <tr key={inc.id} className="border-b hover:bg-indigo-50 transition">
                <td className="py-3 px-6">{inc.description}</td>
                <td className="py-3 px-6">{inc.amount}</td>
                <td className="py-3 px-6">{inc.date}</td>
                <td className="py-3 px-6 space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm"
                    onClick={() => setEditingIncome(inc)}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md text-sm"
                    onClick={() => handleDeleteIncome(inc.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Edit Incom*/}
      {editingIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="font-semibold mb-4">Modifier Revenu</h2>
            <input
              type="number"
              placeholder="Montant"
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
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateIncome}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;