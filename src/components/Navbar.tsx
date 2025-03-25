import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { role, setToken, token } = useAuth();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  const userName = (() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.name || payload.email;
    } catch {
      return null;
    }
  })();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block transition-colors font-medium text-base px-3 py-2 rounded-lg ${
      isActive ? "text-white bg-[#31715C]" : "text-gray-700 hover:bg-[#31715C] hover:text-white"
    }`;

  return (
    <nav className="bg-white shadow-md px-6 sm:px-10 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-[#31715C]">VALES GDC</div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center space-x-6">
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
              <span className="cursor-pointer text-gray-700 hover:bg-[#31715C] hover:text-white font-medium text-base px-3 py-2 rounded-lg">
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

          {userName && (
            <span className="text-sm text-gray-700 font-medium">👤 {userName}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden text-gray-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="sm:hidden mt-4 space-y-2">
          <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/pendientes" className={linkClass} onClick={() => setMobileOpen(false)}>
            Pendientes
          </NavLink>

          {role === "scrum" && (
            <>
              <NavLink to="/admin/vales" className={linkClass} onClick={() => setMobileOpen(false)}>
                Admin - Vales
              </NavLink>
              <NavLink to="/admin/usuarios" className={linkClass} onClick={() => setMobileOpen(false)}>
                Admin - Usuarios
              </NavLink>
            </>
          )}

          <div className="px-3">
            {userName && (
              <p className="text-sm text-gray-600 mb-2">👤 {userName}</p>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
