// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css';

import Landing from "./pages/Landing";
import UsuarioDashboard from "./pages/cliente/UsuarioDashboard";
import RepartidorDashboard from "./pages/repartidor/RepartidorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard"; // 👈 Importación añadida
import Login from "./pages/Login";
import Register from "./pages/Register";
import InventarioCliente from "./pages/cliente/Inventario";
import ClientesFrecuentes from "./pages/cliente/ClientesFrecuentes";
import Envios from "./pages/cliente/Envios";
import OrderDetail from "./pages/cliente/OrderDetail"; // ✅ Vista detalle
import Recolecciones from "@/pages/superadmin/Recolecciones";
import Entregas from "@/pages/superadmin/Entregas";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-darkBackground transition-colors duration-500">
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Dashboards por rol */}
          <Route path="/dashboard-cliente" element={<UsuarioDashboard />} />
          <Route path="/dashboard-repartidor" element={<RepartidorDashboard />} />
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
          <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} /> {/* ✅ Superadmin */}

          {/* Otras vistas */}
          <Route path="/inventario" element={<InventarioCliente />} />
          <Route path="/clientes-frecuentes" element={<ClientesFrecuentes />} />
          <Route path="/envios" element={<Envios />} />
          <Route path="/detalle-pedido/:id" element={<OrderDetail />} />
          <Route path="/superadmin/recolecciones" element={<Recolecciones />} />
          <Route path="/superadmin/entregas" element={<Entregas />} />

          {/* Fallbacks */}
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
