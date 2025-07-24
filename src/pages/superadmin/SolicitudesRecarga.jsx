import { useEffect, useState } from "react";
import axios from "@/axios";
import PageTransition from "../../shipit-ui/pageTransition";
import { Loader2, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

export default function SolicitudesRecarga() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dropdownActivo, setDropdownActivo] = useState(null);
  const [itemsVisibles, setItemsVisibles] = useState(25);

  const obtenerSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/wallet/solicitudes-recarga", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSolicitudes(res.data);
    } catch (err) {
      toast.error("Error al obtener las solicitudes");
    } finally {
      setCargando(false);
    }
  };

  const aprobarSolicitud = async (solicitud) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/wallet/aprobar-recarga", {
        userId: solicitud.userId,
        transaccionId: solicitud.transaccionId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recarga aprobada");
      obtenerSolicitudes();
    } catch (err) {
      toast.error("Error al aprobar recarga");
    }
  };

  const rechazarSolicitud = async (solicitud) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/wallet/rechazar-recarga", {
        userId: solicitud.userId,
        transaccionId: solicitud.transaccionId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recarga rechazada");
      obtenerSolicitudes();
    } catch (err) {
      toast.error("Error al rechazar recarga");
    }
  };

  const editarSolicitud = async (solicitud) => {
    const nuevoMonto = prompt("Ingresa el nuevo monto:", solicitud.monto);
    if (!nuevoMonto || isNaN(nuevoMonto) || parseFloat(nuevoMonto) <= 0) {
      return toast.error("Monto inválido");
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("/wallet/editar-recarga", {
        userId: solicitud.userId,
        transaccionId: solicitud.transaccionId,
        monto: parseFloat(nuevoMonto),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Monto actualizado");
      obtenerSolicitudes();
    } catch (err) {
      toast.error("Error al actualizar monto");
    }
  };  

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-blue-600">Solicitudes de Recarga</h1>

        {cargando ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : solicitudes.length === 0 ? (
          <p className="text-center text-gray-500">No hay solicitudes pendientes.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Correo</th>
                  <th className="px-4 py-3 text-left">Monto</th>
                  <th className="px-4 py-3 text-left">Método</th>
                  <th className="px-4 py-3 text-left">Banco</th>
                  <th className="px-4 py-3 text-left">CLABE</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
              {solicitudes.slice(0, itemsVisibles).map((s, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700 relative">
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">${s.monto.toFixed(2)}</td>
                    <td className="px-4 py-2">{s.metodo}</td>
                    <td className="px-4 py-2">{s.banco === "Otro" ? s.bancoOtro : s.banco}</td>
                    <td className="px-4 py-2">{s.clabe}</td>
                    <td className="px-4 py-2">{s.fecha}</td>
                    <td className="px-4 py-2">{s.aprobado ? "Aprobado" : "Pendiente"}</td>
                    <td className="px-4 py-2">
                      {!s.aprobado && (
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setDropdownActivo(dropdownActivo === index ? null : index)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {dropdownActivo === index && (
                            <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <button
                                  onClick={() => { aprobarSolicitud(s); setDropdownActivo(null); }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => { rechazarSolicitud(s); setDropdownActivo(null); }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                                >
                                  Rechazar
                                </button>
                                <button
                                  onClick={() => { editarSolicitud(s); setDropdownActivo(null); }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600"
                                >
                                  Editar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {itemsVisibles < solicitudes.length && (
  <div className="text-center p-4">
    <button
      onClick={() => setItemsVisibles((prev) => prev + 25)}
      className="text-sm text-blue-600 hover:underline"
    >
      Ver más
    </button>
  </div>
)}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
