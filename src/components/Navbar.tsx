import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (token) {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = res.data.find((u: any) => token.includes(u.email)); // solo estimado
        if (me) setRole(me.role);
      }
    };
    fetchUserRole();
  }, [token]);

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
