import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import ExpenseList from "./pages/ExpenseList";
import IncomeList from "./pages/IncomeList";
import UserProfile from "./pages/UserProfile";
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/expenses" 
          element={
            <ProtectedRoute>
              <ExpenseList/>
            </ProtectedRoute>
          }
          />
        <Route 
          path="/incomes" 
          element={
            <ProtectedRoute>
              <IncomeList/>
            </ProtectedRoute>
          } 
          />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile/>
            </ProtectedRoute>
          } 
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;