import { useEffect, useState } from "react";
import axios from "@/axios";
import { toast } from "react-hot-toast";

function Repartidores() {
  const [drivers, setDrivers] = useState([]);
  const [nuevoDriver, setNuevoDriver] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    zona: "",
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("/drivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Error al obtener repartidores:", error);
      }
    };

    fetchDrivers();
  }, []);

  const crearDriver = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/drivers", nuevoDriver);
      toast.success("Repartidor creado exitosamente");
      setNuevoDriver({ nombre: "", telefono: "", correo: "", zona: "" });
      const response = await axios.get("/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Error al crear repartidor:", error);
      toast.error("Error al crear repartidor");
    }
  };

  return (
    <div className="pt-20 p-6">
      <h1 className="text-3xl font-bold mb-6">Repartidores</h1>

      {/* Formulario para crear repartidor */}
      <form onSubmit={crearDriver} className="bg-white p-6 rounded shadow-md space-y-4 mb-8">
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <input
            type="text"
            value={nuevoDriver.nombre}
            onChange={(e) => setNuevoDriver({ ...nuevoDriver, nombre: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Teléfono</label>
          <input
            type="text"
            value={nuevoDriver.telefono}
            onChange={(e) => setNuevoDriver({ ...nuevoDriver, telefono: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Correo</label>
          <input
            type="email"
            value={nuevoDriver.correo}
            onChange={(e) => setNuevoDriver({ ...nuevoDriver, correo: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Zona (opcional)</label>
          <input
            type="text"
            value={nuevoDriver.zona}
            onChange={(e) => setNuevoDriver({ ...nuevoDriver, zona: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold w-full hover-zoom"
        >
          Crear Repartidor
        </button>
      </form>

      {/* Lista de repartidores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map((driver) => (
          <div key={driver._id} className="bg-white p-4 rounded shadow-md space-y-2">
            <p><strong>Nombre:</strong> {driver.nombre}</p>
            <p><strong>Teléfono:</strong> {driver.telefono}</p>
            <p><strong>Correo:</strong> {driver.correo}</p>
            <p><strong>Zona:</strong> {driver.zona || "No asignada"}</p>
            <p><strong>Estatus:</strong> {driver.estatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Repartidores;
