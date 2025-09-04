import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // état pour afficher le popup
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard"); // redirection vers dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      // le popup disparaît automatiquement après 3 secondes
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {error && (
        <div className="fixed top-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
          {error}
        </div>
      )}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h1>
        <p className="text-center text-gray-500 mb-6">Please enter login details below</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Sign in
          </button>
          <p className="text-center text-gray-500 text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}