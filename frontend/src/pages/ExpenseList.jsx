import React, { useEffect, useState } from 'react';

const ExpenseList = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    fetchExpenses();
    fetchReceipts();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('http://localhost:8080/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Erreur fetch expenses:', err);
    }
  };

  const fetchReceipts = async () => {
    try {
      const res = await fetch('http://localhost:8080/receipts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReceipts(data);
    } catch (err) {
      console.error('Erreur fetch receipts:', err);
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

      if (!res.ok) throw new Error('Erreur lors du téléversement');

      const data = await res.json();
      setReceipts(prev => [data, ...prev]);
      alert('Reçu téléversé avec succès !');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(prev => ({ ...prev, [expenseId]: false }));
    }
  };

  return (
    <div className="p-6 ml-64 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Liste des Dépenses</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Montant</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Reçu</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="border-b hover:bg-indigo-50 transition">
                <td className="py-3 px-6">{exp.name}</td>
                <td className="py-3 px-6">{exp.amount}</td>
                <td className="py-3 px-6">{exp.date}</td>
                <td className="py-3 px-6 space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm">
                      {uploading[exp.id] ? 'Téléversement...' : 'Téléverser'}
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
                          Voir le reçu
                        </a>
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
