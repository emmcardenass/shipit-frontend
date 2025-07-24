// src/pages/superadmin/Inventario.jsx
import { useState } from "react";
import { Boxes, Search, PackageCheck } from "lucide-react";

export default function Inventario() {
  const [busqueda, setBusqueda] = useState("");

  const productos = [
    {
      id: 1,
      nombre: "Caja tipo A",
      stock: 124,
      ubicacion: "Bodega Central",
      estado: "Disponible"
    },
    {
      id: 2,
      nombre: "Etiqueta Térmica",
      stock: 58,
      ubicacion: "Estación Sucursal Sur",
      estado: "Bajo stock"
    }
  ];

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Inventario y Fulfillment
        </h2>

        {/* Buscador */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
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
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Ubicación</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((p) => (
                  <tr key={p.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Boxes size={18} className="text-blue-600" />
                      {p.nombre}
                    </td>
                    <td className="px-4 py-3">{p.ubicacion}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
                          p.estado === "Disponible"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No se encontraron productos
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
