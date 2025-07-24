import { useEffect, useState } from "react";
import axios from "@/axios";
import { Loader } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Recolecciones() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const res = await axios.get("/orders/admin/todos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const soloRecolecciones = res.data.filter(
          (pedido) => pedido.fechaRecoleccionProgramada
        );

        setPedidos(soloRecolecciones);
      } catch (err) {
        console.error("❌ Error al cargar recolecciones:", err);
      } finally {
        setLoading(false);
      }
    };

    obtenerPedidos();
  }, []);

  const filtrarPorFecha = (lista) => {
    if (!fechaFiltro) return lista;

    return lista.filter((pedido) => {
      const fechaPedido = new Date(pedido.fechaRecoleccionProgramada);
      const fechaFormateada = fechaPedido.toISOString().split("T")[0];
      return fechaFormateada === fechaFiltro;
    });
  };

  const pedidosFiltrados = filtrarPorFecha(pedidos);

  const exportarExcel = () => {
    const datos = pedidosFiltrados.map((pedido) => ({
      Nombre: pedido.origen?.nombre || "—",
      Teléfono: pedido.origen?.telefono || "—",
      Dirección: pedido.origen?.direccion || "—",
      Comentarios: pedido.envio?.contenido || "—",
      Email: pedido.origen?.correo || "—",
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recolecciones");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fechaTexto = fechaFiltro || "todas";
    saveAs(blob, `Recolecciones_${fechaTexto}.xlsx`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Pedidos Programados para Recolección
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Filtrar por fecha programada:
          </label>
          <input
            type="date"
            className="p-2 border rounded w-64 dark:bg-gray-800 dark:text-white"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>

        {pedidosFiltrados.length > 0 && (
          <button
            onClick={exportarExcel}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Descargar Excel
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Guía</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Fecha Programada</th>
                <th className="px-4 py-3 text-left">Contenido</th>
                <th className="px-4 py-3 text-left">Peso (kg)</th>
                <th className="px-4 py-3 text-left">Dimensiones (cm)</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3">{pedido.envio?.numeroGuia || "—"}</td>
                    <td className="px-4 py-3">{pedido.origen?.nombre || "—"}</td>
                    <td className="px-4 py-3">{pedido.origen?.telefono || "—"}</td>
                    <td className="px-4 py-3">{pedido.origen?.direccion || "—"}</td>
                    <td className="px-4 py-3">
                      {new Date(pedido.fechaRecoleccionProgramada).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{pedido.envio?.contenido || "—"}</td>
                    <td className="px-4 py-3">{pedido.envio?.peso || "—"}</td>
                    <td className="px-4 py-3">
                      {`${pedido.envio?.alto || 0} × ${pedido.envio?.largo || 0} × ${pedido.envio?.ancho || 0}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                    No hay recolecciones programadas para esa fecha
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
