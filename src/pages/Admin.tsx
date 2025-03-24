// imports arriba
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Admin = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [canjeadores, setCanjeadores] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState("");

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const makeScrum = async (id: number) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/users/${id}/make-scrum`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const crearVale = async () => {
    if (!assignedTo || !expiresAt || canjeadores.length === 0) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/vales`,
        {
          description: "VALE CONSUMO",
          assigned_to: parseInt(assignedTo),
          expires_at: expiresAt,
          canjeadores: canjeadores.map((id) => parseInt(id)),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Vale creado y canjeadores asignados ✅");
      setAssignedTo("");
      setExpiresAt("");
      setCanjeadores([]);
    } catch (err) {
      alert("Error al crear vale");
      console.error(err);
    }
  };

  const crearUsuario = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      alert("Completa todos los campos del nuevo usuario");
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

      alert("Usuario creado ✅");
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      fetchUsers();
    } catch (err) {
      alert("Error al crear usuario");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentUser = (() => {
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    return users.find((u) => u.id === payload?.id);
  })();

  return ( 
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Panel de Scrum Master</h1>

        {/* Asignar vale */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Asignar nuevo VALE CONSUMO</h2>
          <div className="flex flex-col gap-2 max-w-md">
            <label>¿A quién se le asigna el vale?</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Selecciona usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            <label>¿Con quiénes podrá canjearlo?</label>
            <select
              multiple
              value={canjeadores}
              onChange={(e) =>
                setCanjeadores(Array.from(e.target.selectedOptions, (option) => option.value))
              }
              className="p-2 border rounded h-32"
            >
              {users
                .filter((u) => u.id.toString() !== assignedTo)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>

            <label>Fecha de expiración</label>
            <input
              type="date"
              className="p-2 border rounded"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />

            <button
              onClick={crearVale}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Crear vale
            </button>
          </div>
        </section>

        {/* Crear nuevo usuario */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Crear nuevo usuario</h2>
          <div className="flex flex-col gap-2 max-w-md">
            <input
              type="text"
              placeholder="Nombre"
              className="p-2 border rounded"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo"
              className="p-2 border rounded"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="p-2 border rounded"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
            <button
              onClick={crearUsuario}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear usuario
            </button>
          </div>
        </section>

        {/* Tabla de usuarios */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
          <table className="w-full border mt-2 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="flex gap-2 py-2">
                    {u.role !== "scrum" && u.id !== currentUser?.id && (
                      <button
                        onClick={() => makeScrum(u.id)}
                        className="bg-purple-500 text-white px-2 rounded"
                      >
                        Asignar Scrum
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div> 
  );
};

export default Admin;
