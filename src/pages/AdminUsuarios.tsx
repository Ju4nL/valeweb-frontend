import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminUsuarios = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Error al cargar usuarios");
    }
  };

  const makeScrum = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${id}/make-scrum`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      toast.error("Error al asignar rol Scrum");
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      toast.error("Error al eliminar usuario");
    }
  };

  const crearUsuario = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.warn("Completa todos los campos del nuevo usuario");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: "user",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Usuario creado ✅");
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      fetchUsers();
    } catch {
      toast.error("Error al crear usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Crear nuevo usuario */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Crear nuevo usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31715C]"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31715C]"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31715C]"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={crearUsuario}
            className="bg-[#31715C] text-white px-4 py-2 rounded-md hover:bg-[#285f4d] cursor-pointer"
          >
            Crear usuario
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Lista de usuarios</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="flex flex-wrap gap-2 py-2">
                  {user.role !== "scrum" && (
                    <button
                      onClick={() => makeScrum(user.id)}
                      className="bg-[#31715C] text-white px-3 py-1 rounded-md text-xs hover:bg-[#285f4d] cursor-pointer"
                    >
                      Asignar Scrum
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
