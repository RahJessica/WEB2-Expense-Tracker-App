import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col justify-between">
      
      {/* Logo */}
      <div className="p-6 text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer">
        TrackHack
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 px-6">
        <Link
          to="/dashboard"
          className="relative text-gray-700 hover:text-green-500 font-medium py-2 px-3 rounded-md transition-colors hover:bg-green-50"
        >
          Dashboard
        </Link>
        <Link
          to="/expenses"
          className="relative text-gray-700 hover:text-green-500 font-medium py-2 px-3 rounded-md transition-colors hover:bg-green-50"
        >
          Expenses
        </Link>
        <Link
          to="/incomes"
          className="relative text-gray-700 hover:text-green-500 font-medium py-2 px-3 rounded-md transition-colors hover:bg-green-50"
        >
          Income
        </Link>
        <Link
          to="/profile"
          className="relative text-gray-700 hover:text-green-500 font-medium py-2 px-3 rounded-md transition-colors hover:bg-green-50"
        >
          My Profile
        </Link>
      </nav>

      {/* Logout Button */}
      {isLoggedIn && (
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow transition-all"
          >
            Logout
            <span className="bg-white text-green-500 p-1 rounded-full">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Navbar;
