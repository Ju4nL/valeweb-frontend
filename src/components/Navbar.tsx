import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { role, setToken, token } = useAuth();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors font-medium text-base p-2 rounded-lg ${
      isActive ? "text-white bg-[#31715C]" : "text-gray-700 hover:bg-[#31715C] hover:text-white"
    }`;

  const userName = (() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.name || payload.email;
    } catch {
      return null;
    }
  })();

  return (
    <nav className="bg-white shadow-md px-10 py-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-6 relative">
        {/* Título del sistema */}
        <span className="text-xl font-bold text-[#31715C] mr-6">VALES GDC</span>

        {/* Navegación principal */}
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/pendientes" className={linkClass}>
          Pendientes
        </NavLink>

        {role === "scrum" && (
          <div
            className="relative"
            onMouseEnter={() => setShowAdminMenu(true)}
            onMouseLeave={() => setShowAdminMenu(false)}
          >
            <span className="cursor-pointer transition-colors font-medium text-base p-2 rounded-lg text-gray-700 hover:bg-[#31715C] hover:text-white">
              Admin
            </span>

            {showAdminMenu && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg border w-40 z-50">
                <NavLink
                  to="/admin/vales"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F0F0F0]"
                >
                  Vales
                </NavLink>
                <NavLink
                  to="/admin/usuarios"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F0F0F0]"
                >
                  Usuarios
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {userName && (
          <span className="text-sm text-gray-700 font-medium hidden sm:inline">
            👤 {userName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
