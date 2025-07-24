// src/pages/superadmin/Finanzas.jsx
import { DollarSign, CreditCard, BarChart3, FileText, Percent } from "lucide-react";

export default function Finanzas() {
  const stats = [
    {
      titulo: "Ingresos Hoy",
      valor: "$2,350",
      icono: <DollarSign size={20} />,
      color: "bg-green-100 text-green-800",
    },
    {
      titulo: "COD Pendientes",
      valor: "$4,120",
      icono: <CreditCard size={20} />,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      titulo: "Comisiones por Guías",
      valor: "$980",
      icono: <Percent size={20} />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      titulo: "Utilidad Bruta Mes",
      valor: "$12,730",
      icono: <BarChart3 size={20} />,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Finanzas y Reportes
        </h2>

        {/* Tarjetas financieras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
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

        {/* Placeholder de exportación y gráficas */}
        <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
          <FileText className="mx-auto mb-2" size={32} />
          <p>Próximamente: exportar reportes contables, márgenes por zona, comparativas históricas y calculadora de rentabilidad.</p>
        </div>
      </div>
    </div>
  );
}
