
const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/signup"; 
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav>
      <a href="/">Accueil</a>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;
