// src/pages/superadmin/Integraciones.jsx
import { Plug, KeyRound, FileText } from "lucide-react";

export default function Integraciones() {
  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Plug size={32} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Integraciones y API
          </h2>
        </div>

        {/* Claves API */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <KeyRound size={20} /> Claves API por Cliente
          </h3>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 bg-white/60 dark:bg-gray-900/30 shadow-inner">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Aquí podrás generar, revocar o consultar claves API para clientes conectados.
            </p>
            <input
              type="text"
              placeholder="Ej: 1a2b3c4d5e"
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Generar nueva clave
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                Revocar clave
              </button>
            </div>
          </div>
        </div>

        {/* Integraciones activas */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <Plug size={20} /> Conexiones activas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { nombre: "Shopify", estado: "✅ Activa" },
              { nombre: "WooCommerce", estado: "⏳ En pruebas" },
              { nombre: "TiendaNube", estado: "🔌 No conectada" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-300 dark:border-gray-700 shadow"
              >
                <p className="font-semibold text-gray-800 dark:text-white">{item.nombre}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.estado}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentación API */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <FileText size={20} /> Documentación
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Pronto podrás descargar la documentación completa de la API en formato PDF o JSON.
          </p>
          <div className="flex gap-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
              Descargar PDF
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
              Descargar JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
