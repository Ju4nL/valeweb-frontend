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
      fetchVales();
    } catch {
      toast.error("Error al enviar vale");
    }
  };

  const [rompiendo, setRompiendo] = useState<number | null>(null);

  const handleCanjearConAnimacion = (canjeoId: number) => {
    setRompiendo(canjeoId);

    setTimeout(async () => {
      await handleCanjear(canjeoId);
      setRompiendo(null);
    }, 700);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-lg sm:text-2xl font-bold mb-6 text-center">Mis Vales Asignados</h1>
      {vales.length === 0 ? (
        <p className="text-sm sm:text-base text-center">No tienes vales disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vales.map((vale) => (
            <div key={vale.canjeo_id} className="flex mx-2 text-xs sm:text-sm">
              {/* Izquierda */}
              <div className="relative sm:pl-10 p-3  flex-1 overflow-hidden bg-[#8BC1AF] ">
                <div className="absolute top-0 right-0 h-full w-[1px]  border-r-2 border-green-900 border-dashed z-0"></div>

                {/* Esquinas recortadas */}
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>

                {/* Contenido */}
                <h2 className="text-base sm:text-xl font-extrabold mb-1">Reconocimiento</h2>
                <p className="text-xs sm:text-sm">🎖️</p>
                <h1 className="text-lg sm:text-2xl font-extrabold text-amber-100 mb-2">
                  {vale.description}
                </h1>
                <p className="text-[11px] sm:text-sm font-light mb-1">
                  Sólo se puede usar una vez, a voluntad de <strong>{vale.to_user_name}</strong>
                </p>
                <p className="text-[11px] sm:text-sm font-semibold mb-2">
                  Gestión del cambio y uso de la información
                </p>
                <p className="text-[10px] italic text-gray-600">
                  * Válido hasta: {new Date(vale.expires_at).toLocaleDateString()}
                </p>
              </div>

              {/* Derecha - imagen */}
              <div
                className={`bg-[#8BC1AF]  w-24 sm:w-32 flex flex-col items-center justify-center p-3 relative overflow-hidden transition-transform duration-700 origin-bottom-right ${
                  vale.accepted === false || rompiendo === vale.canjeo_id ? "rotate-[5deg]" : ""
                }`}
              >
                {/* Esquinas recortadas */}
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>

                <img
                  src={ValeImg}
                  alt="Vale ilustración"
                  className="w-full object-contain max-w-[90px] sm:max-w-[120px]"
                />
                <div className="mt-3">
                  {vale.accepted === false ? (
                    <button
                      disabled
                      className="bg-amber-100 text-green-950 text-[11px] sm:text-sm px-3 py-1 rounded cursor-not-allowed"
                    >
                      Pendiente
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCanjearConAnimacion(vale.canjeo_id)}
                      className="bg-[#287259] text-white text-[11px] sm:text-sm px-3 py-1 rounded hover:bg-[#388E71] cursor-pointer"
                    >
                      Canjear
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
