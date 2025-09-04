import { Fragment, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      alert("Compte créé avec succès !");
      setForm({ username: "", email: "", password: "" });
      navigate("/auth/login"); 
    } catch (err) {
      alert(err.response?.data?.error || "Erreur signup");
    }
  };

  return (
    <>
    <div className="flex flex-col h-full items-center">
    <h1 className="text-3xl font-bold text-center mt-3">Inscrivez-vous !</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <input
        name="username"
        placeholder="Nom"
        value={form.username}           
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
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
      <button className="bg-green-500 text-white p-2 rounded">S’inscrire</button>
    </form>
    </div>
    </>
  );
}