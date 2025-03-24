import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminVales = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [canjeadores, setCanjeadores] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState("");

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

  const crearVale = async () => {
    if (!assignedTo || !expiresAt || canjeadores.length === 0) {
      toast.warn("Completa todos los campos");
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

      toast.success("Vale creado ✅");
      setAssignedTo("");
      setExpiresAt("");
      setCanjeadores([]);
    } catch {
      toast.error("Error al crear vale");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Asignar nuevo VALE CONSUMO</h1>
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">¿A quién se le asigna el vale?</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31715C]"
          >
            <option value="">Selecciona usuario</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">¿Con quiénes podrá canjearlo?</label>
          <select
            multiple
            value={canjeadores}
            onChange={(e) =>
              setCanjeadores(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-[#31715C]"
          >
            {users
              .filter((u: any) => u.id.toString() !== assignedTo)
              .map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Fecha de expiración</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31715C]"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <button
          onClick={crearVale}
          className="bg-[#31715C] text-white px-4 py-2 rounded-md hover:bg-[#285f4d]"
        >
          Crear vale
        </button>
      </div>
    </div>
  );
};

export default AdminVales;