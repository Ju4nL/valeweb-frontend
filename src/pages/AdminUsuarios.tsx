import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      toast.success("Inicio de sesión exitoso 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login fallido. Verifica tus credenciales.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm p-8 rounded-xl shadow-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#388E71]">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E71]"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E71]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#388E71] text-white font-semibold p-3 rounded-lg hover:bg-[#31715C] transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
