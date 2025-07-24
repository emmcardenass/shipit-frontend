import { useEffect, useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";
import MapaZonas from "../../components/MapaZonas";
import Select from "react-select";
import SubirTarifasExcel from "../../components/SubirTarifasExcel";

export default function Tarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [zonasDisponibles, setZonasDisponibles] = useState([]);
  const [nuevaTarifa, setNuevaTarifa] = useState({
    zonas: [],
    precio: "",
    pesoMin: "",
    pesoMax: "",
    tipoServicio: "",
  });

  const [filtroTarifa, setFiltroTarifa] = useState("");
  const [tarifaEditando, setTarifaEditando] = useState(null);

  useEffect(() => {
    obtenerTarifas();
    obtenerZonas();
  }, []);

  const obtenerTarifas = async () => {
    try {
      const res = await axios.get("/tarifas");
      setTarifas(res.data);
    } catch (err) {
      toast.error("Error al obtener tarifas");
    }
  };

  const obtenerZonas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/zonas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setZonasDisponibles(res.data);
    } catch (err) {
      toast.error("Error al obtener zonas");
    }
  };

  const crearTarifa = async () => {
    const { zonas, precio, pesoMin, pesoMax, tipoServicio } = nuevaTarifa;
    if (!zonas.length || !precio || !pesoMin || !pesoMax || !tipoServicio) {
      return toast.error("Completa todos los campos y selecciona zonas");
    }

    try {
      await axios.post("/tarifas", nuevaTarifa);
      toast.success("Tarifa creada");
      setNuevaTarifa({
        zonas: [],
        precio: "",
        pesoMin: "",
        pesoMax: "",
        tipoServicio: "",
      });
      obtenerTarifas();
    } catch (err) {
      toast.error("Error al crear tarifa");
    }
  };

  const eliminarTarifa = async (id) => {
    try {
      await axios.delete(`/tarifas/${id}`);
      toast.success("Tarifa eliminada");
      obtenerTarifas();
    } catch (err) {
      toast.error("Error al eliminar tarifa");
    }
  };

  const guardarPrecioEditado = async (id) => {
    try {
      await axios.put(`/tarifas/${id}`, {
        ...tarifas.find(t => t._id === id),
        precio: tarifaEditando.precio,
      });
      toast.success("Precio actualizado");
      setTarifaEditando(null);
      obtenerTarifas();
    } catch (err) {
      toast.error("Error al actualizar precio");
    }
  };

  const tarifasFiltradas = tarifas.filter((tarifa) => {
    const zonaNombres = (tarifa.zonas || [])
      .map((zonaId) => {
        const zona = zonasDisponibles.find(z => z._id === zonaId);
        return zona ? zona.nombre : zonaId;
      })
      .join(", ")
      .toLowerCase();

    return (
      zonaNombres.includes(filtroTarifa.toLowerCase()) ||
      tarifa.tipoServicio?.toLowerCase().includes(filtroTarifa.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Gestión de Tarifas</h2>

        {/* Formulario de nueva tarifa */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Selección de zonas */}
          <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-white col-span-2 md:col-span-3">
            Zonas aplicables:
            <Select
              isMulti
              options={zonasDisponibles.map(zona => ({ label: zona.nombre, value: zona._id }))}
              value={zonasDisponibles
                .filter(zona => nuevaTarifa.zonas.includes(zona._id))
                .map(zona => ({ label: zona.nombre, value: zona._id }))}
              onChange={(selected) =>
                setNuevaTarifa({
                  ...nuevaTarifa,
                  zonas: selected.map(option => option.value),
                })
              }
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </label>

          <input
            type="number"
            placeholder="Precio (MXN)"
            value={nuevaTarifa.precio}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, precio: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Peso mínimo (kg)"
            value={nuevaTarifa.pesoMin}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, pesoMin: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Peso máximo (kg)"
            value={nuevaTarifa.pesoMax}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, pesoMax: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />

          <select
            value={nuevaTarifa.tipoServicio}
            onChange={(e) => setNuevaTarifa({ ...nuevaTarifa, tipoServicio: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Tipo de servicio</option>
            <option value="express">Express</option>
            <option value="standard">Día siguiente</option>
            <option value="fulfillment">Fulfillment</option>
          </select>
        </div>

        <button
          onClick={crearTarifa}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-8"
        >
          Crear Tarifa
        </button>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por zona o servicio..."
          value={filtroTarifa}
          onChange={(e) => setFiltroTarifa(e.target.value)}
          className="border px-4 py-2 rounded-lg mb-4 w-full"
        />

        {/* Tabla de tarifas con scroll */}
        <div className="overflow-auto max-h-[400px] rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">Zonas</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Peso</th>
                <th className="px-4 py-3 text-left">Servicio</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tarifasFiltradas.map((tarifa) => (
                <tr key={tarifa._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">
                    {(tarifa.zonas || []).map((zonaId) => {
                      const zona = zonasDisponibles.find(z => z._id === zonaId);
                      return zona ? zona.nombre : zonaId;
                    }).join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {tarifaEditando && tarifaEditando.id === tarifa._id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={tarifaEditando.precio}
                          onChange={(e) =>
                            setTarifaEditando({ ...tarifaEditando, precio: e.target.value })
                          }
                          className="border px-2 py-1 rounded w-24"
                        />
                        <button
                          onClick={() => guardarPrecioEditado(tarifa._id)}
                          className="text-green-600 hover:underline"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          setTarifaEditando({ id: tarifa._id, precio: tarifa.precio })
                        }
                        className="cursor-pointer"
                      >
                        $ {tarifa.precio} MXN
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {tarifa.pesoMin} kg - {tarifa.pesoMax} kg
                  </td>
                  <td className="px-4 py-2 capitalize">{tarifa.tipoServicio}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => eliminarTarifa(tarifa._id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {tarifasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    No hay tarifas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <SubirTarifasExcel
          zonasDisponibles={zonasDisponibles}
          onTarifasActualizadas={obtenerTarifas}
        />

        {/* Mapa de zonas */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Mapa de Zonas
          </h3>
          <MapaZonas />
        </div>
      </div>
    </div>
  );
}
