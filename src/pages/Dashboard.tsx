import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ValeImg from "../assets/vale.png";
import { toast } from "react-toastify";

interface Vale {
  canjeo_id: number;
  vale_id: number;
  description: string;
  expires_at: string;
  to_user_name: string;
  accepted: boolean | null;
}

const Dashboard = () => {
  const { token } = useAuth();
  const [vales, setVales] = useState<Vale[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchVales();
  }, [token]);

  const fetchVales = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/vales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVales(res.data);
    } catch {
      toast.error("Error cargando vales");
    }
  };

  const handleCanjear = async (canjeoId: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/vale_canjeo/${canjeoId}/enviar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Vale enviado 🎉");
      fetchVales(); // actualizamos el estado del vale (ya fue enviado)
    } catch {
      toast.error("Error al enviar vale");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Vales Asignados</h1>
      {vales.length === 0 ? (
        <p>No tienes vales disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vales.map((vale) => (
            <div
              key={vale.canjeo_id}
              className="bg-[#B9D8C2] rounded-lg shadow-md flex overflow-hidden"
            >
              {/* Izquierda */}
              <div className="p-4 flex-1">
                <h2 className="text-sm font-medium text-gray-700 mb-1">🎖️ Reconocimiento</h2>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{vale.description}</h1>
                <p className="text-sm mb-1">
                  Sólo se puede usar una vez, a voluntad de <strong>{vale.to_user_name}</strong>
                </p>
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Gestión del cambio y uso de la información
                </p>
                <p className="text-xs italic text-gray-600">
                  Válido hasta: {new Date(vale.expires_at).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  {vale.accepted === false ? (
                    <button
                      disabled
                      className="bg-yellow-400 text-white px-4 py-1 rounded cursor-not-allowed"
                    >
                      Pendiente de aceptación...
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCanjear(vale.canjeo_id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Canjear
                    </button>
                  )}
                </div>
              </div>

              {/* Derecha - imagen */}
              <div className="w-40 flex items-center justify-center bg-white p-2">
                <img src={ValeImg} alt="Vale ilustración" className="w-full object-contain" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
