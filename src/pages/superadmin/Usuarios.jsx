// src/pages/superadmin/Usuarios.jsx
import { useEffect, useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import axios from "@/axios";

export default function Usuarios() {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [orden, setOrden] = useState("importancia"); // opciones: importancia | recientes | antiguos

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users/clientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("✅ Usuarios recibidos del backend:", res.data);
        setUsuarios(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuarios:", err);
      }
    };
  
    obtenerUsuarios();
  }, []);    

  const usuariosFiltrados = usuarios
    .filter((usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === "importancia") {
        return b.totalIngresos - a.totalIngresos;
      } else if (orden === "recientes") {
        return new Date(b.creadoEn) - new Date(a.creadoEn);
      } else if (orden === "antiguos") {
        return new Date(a.creadoEn) - new Date(b.creadoEn);
      } else {
        return 0;
      }
    });

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Gestión de Usuarios (Clientes)
        </h2>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              className="w-full border rounded-lg px-10 py-2"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <select
            className="border px-3 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="importancia">Más importantes primero</option>
            <option value="recientes">Cuentas más nuevas</option>
            <option value="antiguos">Cuentas más antiguas</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Envíos (Total)</th>
                <th className="px-4 py-3 text-left">Últimos 30 días</th>
                <th className="px-4 py-3 text-left">Última semana</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3">{usuario.nombre}</td>
                    <td className="px-4 py-3">{usuario.correo}</td>
                    <td className="px-4 py-3">{usuario.telefono}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{usuario._id}</td>
                    <td className="px-4 py-3">{usuario.enviosTotal}</td>
                    <td className="px-4 py-3">{usuario.enviosMes}</td>
                    <td className="px-4 py-3">{usuario.enviosSemana}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button className="text-blue-600 hover:underline">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-red-600 hover:underline">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                    No se encontraron usuarios
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
