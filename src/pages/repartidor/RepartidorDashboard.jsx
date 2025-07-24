// src/pages/repartidor/RepartidorDashboard.jsx
import { useEffect, useState } from "react";
import { MapPin, Package, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "@/axios";

export default function RepartidorDashboard() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const obtenerPedidos = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/envios/asignados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(res.data);
    } catch (error) {
      toast.error("Error al cargar pedidos asignados");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-zinc-800 dark:text-white">Tus entregas</h1>
        <button
          onClick={obtenerPedidos}
          className="bg-indigo-600 text-white px-4 py-1 rounded-lg flex items-center gap-1 text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Recargar
        </button>
      </div>

      {cargando ? (
        <p className="text-center text-zinc-500">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-center text-zinc-500">No tienes entregas asignadas.</p>
      ) : (
        <div className="space-y-3 overflow-y-auto">
          {pedidos.map((pedido) => (
            <div
              key={pedido._id}
              className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl shadow border border-zinc-200 dark:border-zinc-700"
            >
              <h2 className="font-semibold text-zinc-800 dark:text-white text-base">
                {pedido.envio.destinatario}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {pedido.destino.direccion}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Tel: {pedido.destino.telefono}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 italic">
                {pedido.estado}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={cerrarSesion}
        className="mt-auto text-center text-red-500 text-sm mt-8"
      >
        <LogOut className="w-4 h-4 inline mr-1" /> Cerrar sesión
      </button>
    </div>
  );
}
