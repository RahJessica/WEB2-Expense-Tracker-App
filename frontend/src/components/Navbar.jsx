import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login"); 
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="px-6 py-4 text-2xl font-bold border-b border-gray-700">
        TrackHack
      </div>

      {/* Liens */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-4 text-lg">
        <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded">
          Dashboard
        </Link>
        <Link to="/expenses" className="hover:bg-gray-700 px-3 py-2 rounded">
          Expenses
        </Link>
        <Link to="/incomes" className="hover:bg-gray-700 px-3 py-2 rounded">
          Incomes
        </Link>
        <Link to="/profile" className="hover:bg-gray-700 px-3 py-2 rounded">
          My Profile
        </Link>
      </nav>

      {/* Bouton logout */}
      {isLoggedIn && (
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            <span>Logout</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </aside>
  );
}