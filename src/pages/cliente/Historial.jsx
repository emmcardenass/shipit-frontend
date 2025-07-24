import { useEffect, useState } from "react";
import axios from "@/axios";
import PageTransition from "../../shipit-ui/pageTransition";
import ResponsiveSection from "../../components/ResponsiveSection";
import { motion } from "framer-motion";
import { PackageCheck, X } from "lucide-react";
import toast from "react-hot-toast";

export default function Historial() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    servicio: "",
  });

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const res = await axios.get("/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const pedidosFiltrados = res.data.filter(
          (p) => p.estado === "entregado" || p.estado === "cancelado"
        );

        setPedidos(pedidosFiltrados);
      } catch (error) {
        toast.error("Error al cargar tu historial");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const pedidosFiltradosYBuscados = pedidos.filter((pedido) => {
    const { nombre, telefono, fecha, servicio } = filtro;
    return (
      (!nombre ||
        pedido?.destino?.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (!telefono || pedido?.destino?.telefono?.includes(telefono)) &&
      (!fecha ||
        new Date(pedido.createdAt).toISOString().slice(0, 10) === fecha) &&
      (!servicio || pedido?.envio?.tipo === servicio)
    );
  });

  return (
    <PageTransition>
      <ResponsiveSection>
        <motion.div
          className="max-w-7xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Historial de Envíos
</h1>

          {/* Filtros */}
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"></label>
              <input
                type="text"
                name="nombre"
                placeholder="Buscar por nombre"
                value={filtro.nombre}
                onChange={handleFiltroChange}
                className="input-glass px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkSecondary placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"></label>
              <input
                type="text"
                name="telefono"
                placeholder="Buscar por teléfono"
                value={filtro.telefono}
                onChange={handleFiltroChange}
                className="input-glass px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkSecondary placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"></label>
              <input
                type="date"
                name="fecha"
                value={filtro.fecha}
                onChange={handleFiltroChange}
                className={`input-glass px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkSecondary ${
                  filtro.fecha ? "text-gray-700 dark:text-gray-200" : "text-gray-400"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"></label>
              <select
                name="servicio"
                value={filtro.servicio}
                onChange={handleFiltroChange}
                className={`appearance-none px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkSecondary ${
                  filtro.servicio ? "text-gray-700 dark:text-gray-200" : "text-gray-400"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none text-base leading-[1.5]`}
              >
                <option value="">Todos los servicios</option>
                <option value="express">Express Mismo Día</option>
                <option value="standard">Standard Día Siguiente</option>
                <option value="fulfillment">Fulfillment Mismo Día</option>
              </select>
            </div>
          </div>

          {/* Lista de pedidos */}
          {cargando ? (
            <p className="text-center text-gray-500">Cargando pedidos...</p>
          ) : pedidosFiltradosYBuscados.length === 0 ? (
            <p className="text-center text-gray-400">
              Aún no tienes envíos completados o cancelados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pedidosFiltradosYBuscados.map((pedido) => {
                const icono =
                  pedido.estado === "entregado" ? (
                    <PackageCheck className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  );

                return (
                  <motion.div
                    key={pedido._id}
                    className="card-glass p-4 rounded-lg shadow hover:shadow-md transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {new Date(pedido.createdAt).toLocaleString()}
                      </div>
                      {icono}
                    </div>
                    <h2 className="text-lg font-semibold mt-2 text-blue-600">
                      {pedido.envio?.numeroGuia || "—"}
                    </h2>
                    <p className="text-sm mt-1">
                      Destinatario:{" "}
                      <span className="font-medium">
                        {pedido.destino?.nombre || "—"}
                      </span>
                    </p>
                    <p className="text-sm">
                      Dirección: {pedido.destino?.direccion || "—"}
                    </p>
                    <p className="text-sm">
                      Estado:{" "}
                      <span
                        className={`font-bold ${
                          pedido.estado === "entregado"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </ResponsiveSection>
    </PageTransition>
  );
}
