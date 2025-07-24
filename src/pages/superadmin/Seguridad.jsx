// src/pages/superadmin/Seguridad.jsx
import { ShieldAlert, UserCheck, AlertTriangle, Undo2, Trash2, Eye } from "lucide-react";

export default function Seguridad() {
  const controles = [
    {
      titulo: "Registros de Acceso",
      descripcion: "Consulta quién ha ingresado, desde dónde y cuándo.",
      icono: <Eye size={24} />,
    },
    {
      titulo: "Alertas de Seguridad",
      descripcion: "Detecta accesos sospechosos o repetidos intentos fallidos.",
      icono: <AlertTriangle size={24} />,
    },
    {
      titulo: "Limpieza del Sistema",
      descripcion: "Elimina cuentas inactivas, registros obsoletos o duplicados.",
      icono: <Trash2 size={24} />,
    },
    {
      titulo: "Control de Roles y Permisos",
      descripcion: "Define con precisión qué puede hacer cada tipo de usuario.",
      icono: <UserCheck size={24} />,
    },
    {
      titulo: "Restaurar Sistema / Backup",
      descripcion: "Regresa a una versión estable si algo sale mal.",
      icono: <Undo2 size={24} />,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Seguridad y Auditoría
        </h2>

        {/* Tarjetas de control */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {controles.map((item, index) => (
            <div
              key={index}
              className="rounded-xl p-5 bg-white/70 dark:bg-gray-800/50 shadow-md flex items-start gap-4"
            >
              <div className="p-3 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white shadow-inner">
                {item.icono}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.titulo}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de logs futuros */}
        <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
          <ShieldAlert className="mx-auto mb-2" size={32} />
          <p>Próximamente: logs detallados, rastreo en tiempo real de cambios y alertas automatizadas por IA.</p>
        </div>
      </div>
    </div>
  );
}
