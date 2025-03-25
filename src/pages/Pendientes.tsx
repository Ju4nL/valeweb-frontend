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
  const [rompiendo, setRompiendo] = useState<number | null>(null);

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

  const handleAceptarConAnimacion = (id: number) => {
    setRompiendo(id);

    setTimeout(async () => {
      await aceptarVale(id);
      setRompiendo(null);
    }, 700);
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Vales que me enviaron
      </h2>
      {vales.length === 0 ? (
        <p className="text-center sm:text-left">No tienes vales pendientes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vales.map((vale) => (
            <div key={vale.id} className="flex items-center sm:items-stretch">
              {/* Izquierda */}
              <div className="relative p-4 pl-10 flex-1 overflow-hidden bg-[#FFEBC1] w-32">
                <div className="absolute top-0 right-0 h-full w-2 border-r-2 border-green-900 border-dashed z-0"></div>
  
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
  
                <h2 className="text-xl font-extrabold mb-1">Vale recibido</h2>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#31715C] mb-2 break-words">
                  {vale.description}
                </h1>
                <p className="text-sm mb-2">
                  Enviado por: <strong>{vale.from_user}</strong>
                </p>
              </div>
  
              {/* Derecha - imagen y botón */}
              <div
                className={`flex flex-col items-center justify-center p-2 relative ml-4 bg-[#FFEBC1] z-10 transition-all duration-700 ease-in-out transform origin-top-right 
                  ${
                    rompiendo === vale.id ? "rotate-12 scale-0 opacity-0" : "rotate-[5deg]"
                  }
                  `}
              >
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
  
                <img src={ValeImg} alt="Vale" className="sm:w-32 w-24  object-contain" />
                <button
                  onClick={() => handleAceptarConAnimacion(vale.id)}
                  className="bg-[#287259] text-white px-4 py-1 rounded hover:bg-[#388E71] cursor-pointer mt-2 text-sm"
                >
                  Aceptar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Pendientes;
