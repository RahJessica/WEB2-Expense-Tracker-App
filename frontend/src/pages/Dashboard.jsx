import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (!data) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <p>Total revenus : {data.totalIncome}</p>
      <p>Total dépenses : {data.totalExpenses}</p>
      <p>Solde restant : {data.balance}</p>
      <p>Filtre : {data.filter}</p>
    </div>
  );
}