import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ValeImg from "../assets/vale.png";

interface ValePendiente {
  id: number;
  description: string;
  from_user: string;
}

const Pendientes = () => {
  const { token } = useAuth();
  const [vales, setVales] = useState<ValePendiente[]>([]);

  const fetchPendientes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/vale_canjeo/pendientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVales(res.data);
    } catch {
      toast.error("Error al cargar vales");
    }
  };

  const aceptarVale = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/vale_canjeo/${id}/aceptar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Vale aceptado 🎉");
      fetchPendientes();
    } catch {
      toast.error("Error al aceptar vale");
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Vales que me enviaron</h2>
      {vales.length === 0 ? (
        <p>No tienes vales pendientes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vales.map((vale) => (
            <div
              key={vale.id}
              className="bg-[#FFEBC1] rounded-lg shadow-md flex overflow-hidden"
            >
              {/* Izquierda */}
              <div className="p-4 flex-1">
                <h2 className="text-sm font-medium text-gray-700 mb-1">🎁 Vale recibido</h2>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{vale.description}</h1>
                <p className="text-sm mb-2">
                  Enviado por: <strong>{vale.from_user}</strong>
                </p>

                <button
                  onClick={() => aceptarVale(vale.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 mt-2"
                >
                  Aceptar
                </button>
              </div>

              {/* Derecha - imagen */}
              <div className="w-40 flex items-center justify-center bg-white p-2">
                <img src={ValeImg} alt="Vale" className="w-full object-contain" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pendientes;
