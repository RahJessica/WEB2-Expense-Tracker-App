import React, { useEffect, useState } from 'react';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: '',
    categoryId: ''
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // Assure-toi que le token est stocké ici

  // Récupérer les revenus
  const fetchIncomes = async () => {
    try {
      const response = await fetch('http://localhost:8080/incomes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIncomes(data);
    } catch (err) {
      console.error('Erreur de chargement :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Gestion du formulaire
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/incomes/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l’ajout du revenu');
      }

      const newIncome = await response.json();
      setIncomes((prev) => [newIncome, ...prev]); // Ajout immédiat à la liste
      setFormData({ amount: '', source: '', description: '', date: '', categoryId: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Erreur :', err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Liste des Revenus</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Montant (€)</th>
                <th className="py-2 px-4 border">Source</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Catégorie</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{income.id}</td>
                  <td className="py-2 px-4 border">{income.amount}</td>
                  <td className="py-2 px-4 border">{income.source || '-'}</td>
                  <td className="py-2 px-4 border">{income.description || '-'}</td>
                  <td className="py-2 px-4 border">
                    {new Date(income.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">{income.categoryId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bouton Ajouter */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Annuler' : 'Ajouter'}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <form
          onSubmit={handleAddIncome}
          className="mt-6 border p-4 rounded bg-gray-50 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Nouveau Revenu</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Montant (€)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Catégorie ID</label>
              <input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default IncomeList;
