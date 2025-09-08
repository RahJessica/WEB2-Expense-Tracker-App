import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import ExpenseList from "./pages/ExpenseList.jsx";
import IncomeList from "./pages/IncomeList.jsx";
import UserProfile from "./pages/UserProfile.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {token && (
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
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;