// src/pages/superadmin/PanelGeneral.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  MapPin,
  AlertCircle,
  Truck,
  CreditCard,
} from "lucide-react";
import MapaPedidos from "../../components/MapaPedidos";
import axios from "@/axios";

export default function PanelGeneral() {
  const [datos, setDatos] = useState({
    pedidosHoy: 0,
    pedidosSemana: 0,
    pedidosMes: 0,
    enviados: 0,
    entregados: 0,
    retrasados: 0,
    facturadoHoy: 0,
    facturadoMes: 0,
    repartidoresActivos: 0,
    zonasSaturadas: [],
    alertas: [],
  });

  const [listaDePedidos, setListaDePedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/orders/admin/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pedidos = res.data;
        setListaDePedidos(pedidos);

        const ahora = new Date();
        const hoy = ahora.toDateString();

        const hace7dias = new Date();
        hace7dias.setDate(ahora.getDate() - 7);

        const hace30dias = new Date();
        hace30dias.setDate(ahora.getDate() - 30);

        const pedidosHoy = pedidos.filter(p => new Date(p.createdAt).toDateString() === hoy);
        const pedidosSemana = pedidos.filter(p => new Date(p.createdAt) >= hace7dias);
        const pedidosMes = pedidos.filter(p => new Date(p.createdAt) >= hace30dias);

        const facturadoHoy = pedidosHoy.reduce((sum, p) => sum + (p.envio?.costo || 0), 0);
        const facturadoMes = pedidosMes.reduce((sum, p) => sum + (p.envio?.costo || 0), 0);

        const entregados = pedidos.filter(p => p.estado === "entregado").length;
        const enRuta = pedidos.filter(p => p.estado === "en_camino").length;
        const retrasados = pedidos.filter(p => ["reagendado", "cancelado"].includes(p.estado)).length;

        setDatos({
          pedidosHoy: pedidosHoy.length,
          pedidosSemana: pedidosSemana.length,
          pedidosMes: pedidosMes.length,
          enviados: enRuta,
          entregados,
          retrasados,
          facturadoHoy: facturadoHoy.toFixed(2),
          facturadoMes: facturadoMes.toFixed(2),
          repartidoresActivos: 0,
          zonasSaturadas: [],
          alertas: [],
        });
      } catch (err) {
        console.error("❌ Error cargando estadísticas:", err);
      }
    };

    fetchPedidos();
  }, []);

  const ahora = new Date();
  const hace7dias = new Date();
  hace7dias.setDate(ahora.getDate() - 7);

  const pedidosUltimos7Dias = listaDePedidos.filter((p) => {
    const fecha = new Date(p.createdAt || p.fechaCreacion || p.fecha);
    return fecha >= hace7dias && fecha <= ahora;
  });

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh] space-y-8">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 Visión General del Negocio</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Card icon={<LineChart />} label="Pedidos hoy" value={datos.pedidosHoy} />
          <Card icon={<LineChart />} label="Pedidos semana" value={datos.pedidosSemana} />
          <Card icon={<LineChart />} label="Pedidos mes" value={datos.pedidosMes} />
          <Card icon={<Truck />} label="En ruta / Entregados" value={`${datos.enviados} / ${datos.entregados}`} />
          <Card icon={<AlertCircle />} label="Retrasados" value={datos.retrasados} />
          <Card icon={<CreditCard />} label="Facturado hoy" value={`$${datos.facturadoHoy}`} />
          <Card icon={<CreditCard />} label="Facturado mes" value={`$${datos.facturadoMes}`} />
          <Card icon={<MapPin />} label="Repartidores activos" value={datos.repartidoresActivos} />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">🔔 Alertas Automáticas</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
            {datos.alertas.map((alerta, i) => (
              <li key={i}>{alerta}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mapa en tiempo real separado visualmente */}
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📍 Mapa de Pedidos y Zonas</h3>
        <MapaPedidos pedidos={pedidosUltimos7Dias} />
      </div>
    </div>
  );
}

function Card({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white/70 dark:bg-white/10 backdrop-blur border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
