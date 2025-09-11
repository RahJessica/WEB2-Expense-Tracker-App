import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import ExpenseList from "./pages/ExpenseList.jsx";
import IncomeList from "./pages/IncomeList.jsx";
import UserProfile from "./pages/UserProfile.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // quand le localStorage change (ex: login ou logout)
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login setToken={setToken} />} />
        <Route path="/auth/signup" element={<Signup setToken={setToken} />} />

        {token ? (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <ExpenseList />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/incomes"
              element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <IncomeList />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <UserProfile />
                  </div>
                </ProtectedRoute>
              }
            />
          </>
        ) : (
          // si pas de token → on redirige vers login
          <Route path="*" element={<Navigate to="/auth/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;