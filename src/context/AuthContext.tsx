import { createContext, useContext, useState, ReactNode } from "react";

// Tipo del contexto
interface AuthContextType {
  token: string | null;
  role: string | null;
  userId: number | null;
  setToken: (token: string | null) => void;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para decodificar el token JWT
const decodeToken = (token: string): { role: string | null; userId: number | null } => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.role || null,
      userId: payload.id || null,
    };
  } catch {
    return { role: null, userId: null };
  }
};

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedToken = localStorage.getItem("token");
  const decoded = storedToken ? decodeToken(storedToken) : { role: null, userId: null };

  const [token, setToken] = useState<string | null>(storedToken);
  const [role, setRole] = useState<string | null>(decoded.role);
  const [userId, setUserId] = useState<number | null>(decoded.userId);

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      const decoded = decodeToken(newToken);
      setRole(decoded.role);
      setUserId(decoded.userId);
    } else {
      localStorage.removeItem("token");
      setRole(null);
      setUserId(null);
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, setToken: updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
