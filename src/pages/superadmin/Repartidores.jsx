// src/pages/superadmin/Repartidores.jsx
import { useState } from "react";
import { Search, MapPin, CalendarDays } from "lucide-react";

export default function Repartidores() {
  const [busqueda, setBusqueda] = useState("");

  const repartidores = [
    {
      id: 1,
      nombre: "Carlos Ramírez",
      zona: "Zona Centro",
      entregas: 27,
      promedioTiempo: "18 min",
      ultEntrega: "2025-05-28"
    },
    {
      id: 2,
      nombre: "Ana López",
      zona: "Zona Sur",
      entregas: 34,
      promedioTiempo: "22 min",
      ultEntrega: "2025-05-29"
    }
  ];

  const filtrados = repartidores.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Gestión de Repartidores
        </h2>

        {/* Buscador */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por nombre o zona..."
              className="w-full border rounded-lg px-10 py-2"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Zona asignada</th>
                <th className="px-4 py-3 text-left">Entregas</th>
                <th className="px-4 py-3 text-left">Tiempo promedio</th>
                <th className="px-4 py-3 text-left">Última entrega</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((r) => (
                  <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3">{r.nombre}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" /> {r.zona}
                    </td>
                    <td className="px-4 py-3">{r.entregas}</td>
                    <td className="px-4 py-3">{r.promedioTiempo}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <CalendarDays size={16} className="text-gray-600" /> {r.ultEntrega}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    No se encontraron repartidores
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
