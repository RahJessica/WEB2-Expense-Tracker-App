import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [popup, setPopup] = useState({ message: "", type: "" }); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showPopup = (message, type = "error") => {
        setPopup({ message, type });
        setTimeout(() => setPopup({ message: "", type: "" }), 3000); // disparaît après 3s
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/signup", form);
            showPopup("Account created successfully!", "success");
            setForm({ username: "", email: "", password: "" });
            setTimeout(() => navigate("/auth/login"), 1500); // redirection après 1.5s
        } catch (err) {
            showPopup(err.response?.data?.error || "Signup error", "error");
        }
    };

    return (
        <div className="flex flex-row items-center justify-center min-h-screen bg-gray-100 relative">
            {/* Popup */}
            {popup.message && (
                <div
                    className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white ${
                        popup.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {popup.message}
                </div>
            )}

            <div className="flex flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Join us for free!</h1>
                    <p className="text-gray-600 mb-6">Please, enter details below</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            name="username"
                            placeholder="Name"
                            value={form.username}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Sign up
                        </button>
                    </form>
                </div>

                <div className="w-1/2 bg-gray-900 text-white p-10 flex flex-col justify-center items-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Manage your Money Anywhere</h2>
                        <p className="text-gray-300">
                            Create your account to manage your money on the go with Quicken on the web.
                        </p>
                    </div>
                    <div className="mt-6">
                        <img
                            src="../../src/assets/signupIllustration.jpg"
                            alt="Signup illustration"
                            className="w-[20vw] h-[40vh] rounded-2xl"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/auth/login")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}