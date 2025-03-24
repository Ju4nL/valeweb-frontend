import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pendientes from "./pages/Pendientes"; 
import ProtectedLayout from "./components/ProtectedLayout";
import Admin from "./pages/Admin";
import AdminVales from "./pages/AdminVales";
import AdminUsuarios from "./pages/AdminUsuarios";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pendientes" element={<Pendientes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/vales" element={<AdminVales />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
