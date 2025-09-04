import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      
      // Stockage du token JWT
      localStorage.setItem("token", res.data.token);

      alert("Connexion réussie !");
      navigate("/dashboard"); // redirection vers dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Erreur login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-sm mx-auto mt-10"
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button className="bg-blue-500 text-white p-2 rounded">Se connecter</button>
    </form>
  );
}