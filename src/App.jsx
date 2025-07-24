// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css';

import { isMobile } from "./utils/isMobile";
import Landing from "./pages/Landing";
import LandingMobile from "./pages/LandingMobile";
import UsuarioDashboard from "./pages/cliente/UsuarioDashboard";
import RepartidorDashboard from "./pages/repartidor/RepartidorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InventarioCliente from "./pages/cliente/Inventario";
import ClientesFrecuentes from "./pages/cliente/ClientesFrecuentes";
import Envios from "./pages/cliente/Envios";
import OrderDetail from "./pages/cliente/OrderDetail";
import Recolecciones from "@/pages/superadmin/Recolecciones";
import Entregas from "@/pages/superadmin/Entregas";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-darkBackground transition-colors duration-500">
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={isMobile() ? <LandingMobile /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Dashboards por rol (bloqueados en móvil) */}
          <Route path="/dashboard-cliente" element={isMobile() ? <Navigate to="/" /> : <UsuarioDashboard />} />
          <Route path="/dashboard-repartidor" element={isMobile() ? <Navigate to="/" /> : <RepartidorDashboard />} />
          <Route path="/dashboard-admin" element={isMobile() ? <Navigate to="/" /> : <AdminDashboard />} />
          <Route path="/superadmin/dashboard" element={isMobile() ? <Navigate to="/" /> : <SuperadminDashboard />} />

          {/* Otras vistas (bloqueadas en móvil también) */}
          <Route path="/inventario" element={isMobile() ? <Navigate to="/" /> : <InventarioCliente />} />
          <Route path="/clientes-frecuentes" element={isMobile() ? <Navigate to="/" /> : <ClientesFrecuentes />} />
          <Route path="/envios" element={isMobile() ? <Navigate to="/" /> : <Envios />} />
          <Route path="/detalle-pedido/:id" element={isMobile() ? <Navigate to="/" /> : <OrderDetail />} />
          <Route path="/superadmin/recolecciones" element={isMobile() ? <Navigate to="/" /> : <Recolecciones />} />
          <Route path="/superadmin/entregas" element={isMobile() ? <Navigate to="/" /> : <Entregas />} />

          {/* Fallbacks */}
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
