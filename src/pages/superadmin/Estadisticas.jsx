// src/pages/superadmin/Estadisticas.jsx
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

export default function Estadisticas() {
  const stats = [
    {
      titulo: "Pedidos Hoy",
      valor: 143,
      icono: <Package size={20} />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      titulo: "Total Ventas Semana",
      valor: "$32,480",
      icono: <DollarSign size={20} />,
      color: "bg-green-100 text-green-800",
    },
    {
      titulo: "Clientes Nuevos",
      valor: 23,
      icono: <Users size={20} />,
      color: "bg-purple-100 text-purple-800",
    },
    {
      titulo: "Zonas Saturadas",
      valor: 2,
      icono: <TrendingUp size={20} />,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      titulo: "Clientes Inactivos",
      valor: 5,
      icono: <TrendingDown size={20} />,
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Estadísticas y Analíticas
        </h2>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-5 flex items-center gap-4 shadow-md ${stat.color} bg-opacity-50 backdrop-blur-lg`}
            >
              <div className="p-3 rounded-full bg-white dark:bg-gray-900 shadow-inner">
                {stat.icono}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{stat.titulo}</h3>
                <p className="text-xl font-bold">{stat.valor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder para gráficas */}
        <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
          <BarChart2 className="mx-auto mb-2" size={32} />
          <p>Aquí se mostrarán las gráficas interactivas con filtros por cliente, zona y servicio.</p>
        </div>
      </div>
    </div>
  );
}
