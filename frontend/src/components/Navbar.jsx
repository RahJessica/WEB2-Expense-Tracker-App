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
    <nav className="bg-white flex flex-row content-between px-2.5 py-1.5 shadow-gray-200 shadow-xl ">
      <div>
        <p className="text-black text-2xl">TrackHack</p> 
      </div>
      <div className="flex flex-row gap-6 text-lg  ">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/incomes">Income</Link>
        <Link to="/profile">My profile</Link>
      </div>
      <div>
      {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 flex flex-row gap-1.5"
            >
              <p className=" text-white">Logout</p>
              <span className="py-0.5 px-0.5 rounded-full bg-white text-black">
                <FontAwesomeIcon icon={faArrowRight}/> 
              </span>
            </button>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
