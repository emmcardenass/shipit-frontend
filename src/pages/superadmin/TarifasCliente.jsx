import { useEffect, useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";

export default function TarifasCliente() {
  const [tarifas, setTarifas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [nuevaTarifa, setNuevaTarifa] = useState({
    clienteId: "",
    zona: "",
    precio: "",
    tipoServicio: "",
    pesoMin: "",
    pesoMax: "",
    incluyeCOD: false,
  });

  useEffect(() => {
    obtenerTarifasCliente();
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("/users/clientes");
      setClientes(res.data);
    } catch (err) {
      toast.error("Error al obtener clientes");
    }
  };

  const obtenerTarifasCliente = async () => {
    try {
      const res = await axios.get("/tarifas-cliente");
      setTarifas(res.data);
    } catch (err) {
      toast.error("Error al obtener tarifas personalizadas");
    }
  };

  const crearTarifa = async () => {
    const { cliente, zona, precio, tipoServicio, pesoMin, pesoMax } = nuevaTarifa;
    if (!cliente || !zona || !precio || !tipoServicio || !pesoMin || !pesoMax) {
      return toast.error("Completa todos los campos");
    }

    try {
      await axios.post("/tarifas-cliente", nuevaTarifa);
      toast.success("Tarifa personalizada creada");
      setNuevaTarifa({
        cliente: "",
        zona: "",
        precio: "",
        tipoServicio: "",
        pesoMin: "",
        pesoMax: "",
        incluyeCOD: false,
      });
      obtenerTarifasCliente();
    } catch (err) {
      toast.error("Error al crear tarifa");
    }
  };

  const eliminarTarifa = async (id) => {
    try {
      await axios.delete(`/tarifas-cliente/${id}`);
      toast.success("Tarifa eliminada");
      obtenerTarifasCliente();
    } catch (err) {
      toast.error("Error al eliminar tarifa");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Tarifas Preferenciales por Cliente</h2>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={nuevaTarifa.clienteId}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, clienteId: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.name} ({cliente.email})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Zona"
            value={nuevaTarifa.zona}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, zona: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Tipo de Servicio"
            value={nuevaTarifa.tipoServicio}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, tipoServicio: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevaTarifa.precio}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, precio: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Peso Mínimo"
            value={nuevaTarifa.pesoMin}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, pesoMin: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Peso Máximo"
            value={nuevaTarifa.pesoMax}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, pesoMax: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />
          <label className="flex items-center col-span-full gap-2">
            <input
              type="checkbox"
              checked={nuevaTarifa.incluyeCOD}
              onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, incluyeCOD: e.target.checked })}
            />
            Incluir comisión COD
          </label>
          <button
            onClick={crearTarifa}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 col-span-full md:col-span-1"
          >
            Crear Tarifa
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Zona</th>
                <th className="px-4 py-2 text-left">Servicio</th>
                <th className="px-4 py-2 text-left">Rango Peso</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">COD</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tarifas.map((t) => (
                <tr key={t._id} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="px-4 py-2">
                    {t.cliente?.name ? `${t.cliente.name} (${t.cliente.email})` : "—"}
                  </td>
                  <td className="px-4 py-2">{t.zona}</td>
                  <td className="px-4 py-2">{t.tipoServicio}</td>
                  <td className="px-4 py-2">
                    {t.pesoMin} kg – {t.pesoMax} kg
                  </td>
                  <td className="px-4 py-2">${t.precio}</td>
                  <td className="px-4 py-2">{t.incluyeCOD ? "✅" : "❌"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => eliminarTarifa(t._id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {tarifas.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">
                    No hay tarifas personalizadas registradas
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
