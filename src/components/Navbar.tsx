import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, role, setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/pendientes" className="hover:underline">
          Pendientes
        </Link>
        {role === "scrum" && (
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        )}
      </div>
      <button onClick={handleLogout} className="hover:underline">
        Cerrar sesión
      </button>
    </nav>
  );
};

export default Navbar;
