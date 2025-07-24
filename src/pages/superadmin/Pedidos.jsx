import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "@/axios";
import toast from "react-hot-toast";

export default function PedidosSimplificado() {
  const [busqueda, setBusqueda] = useState("");
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const res = await axios.get("/orders/admin/todos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPedidos(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar pedidos");
      }
    };

    obtenerPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termino = busqueda.toLowerCase();
    return (
      pedido.envio?.numeroGuia?.toLowerCase().includes(termino) ||
      pedido.destino?.nombre?.toLowerCase().includes(termino) ||
      pedido.destino?.telefono?.includes(termino)
    );
  });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Buscar y Editar Intentos de Entrega
      </h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por guía, nombre o número"
          className="w-full border rounded-lg px-10 py-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Guía</th>
              <th className="px-4 py-3 text-left">Intentos</th>
              <th className="px-4 py-3 text-left">Guardar</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3">{pedido.envio?.numeroGuia || "—"}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={pedido.intentosEntrega || 0}
                      onChange={(e) => {
                        const nuevosPedidos = pedidos.map((p) =>
                          p._id === pedido._id
                            ? { ...p, intentosEntrega: parseInt(e.target.value) }
                            : p
                        );
                        setPedidos(nuevosPedidos);
                      }}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        try {
                          await axios.put(
                            `/orders/admin/update-intentos/${pedido._id}`,
                            { intentosEntrega: pedido.intentosEntrega },
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            }
                          );
                          toast.success("Intentos actualizados");
                        } catch (err) {
                          toast.error("Error al actualizar intentos");
                          console.error(err);
                        }
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No se encontraron pedidos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
