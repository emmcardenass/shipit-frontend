import { useState } from "react";
import Select from "react-select";
import axios from "@/axios";
import toast from "react-hot-toast";

export default function CargaMasivaTarifas({ zonasDisponibles, onTarifasActualizadas }) {
  const [filas, setFilas] = useState([
    { zonas: [], precio: "", pesoMin: "", pesoMax: "", tipoServicio: "" },
  ]);

  const agregarFila = () => {
    setFilas([...filas, { zonas: [], precio: "", pesoMin: "", pesoMax: "", tipoServicio: "" }]);
  };

  const actualizarCampo = (index, campo, valor) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index][campo] = valor;
    setFilas(nuevasFilas);
  };

  const guardarMasivo = async () => {
    try {
      for (const fila of filas) {
        const { zonas, precio, pesoMin, pesoMax, tipoServicio } = fila;
        if (!zonas.length || !precio || !pesoMin || !pesoMax || !tipoServicio) {
          toast.error("Completa todos los campos en todas las filas");
          return;
        }

        await axios.post("/tarifas", fila);
      }

      toast.success("Tarifas creadas masivamente");
      setFilas([{ zonas: [], precio: "", pesoMin: "", pesoMax: "", tipoServicio: "" }]);
      onTarifasActualizadas();
    } catch (err) {
      toast.error("Error al crear tarifas masivas");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Carga Masiva de Tarifas
      </h3>

      {filas.map((fila, index) => (
        <div
          key={index}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-white/70 dark:bg-white/10"
        >
          <Select
            isMulti
            options={zonasDisponibles.map(zona => ({ label: zona.nombre, value: zona._id }))}
            value={zonasDisponibles
              .filter(zona => fila.zonas.includes(zona._id))
              .map(zona => ({ label: zona.nombre, value: zona._id }))}
            onChange={(selected) =>
              actualizarCampo(index, "zonas", selected.map(option => option.value))
            }
            placeholder="Zonas"
          />

          <input
            type="number"
            placeholder="Precio (MXN)"
            value={fila.precio}
            onChange={(e) => actualizarCampo(index, "precio", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Peso mínimo (kg)"
            value={fila.pesoMin}
            onChange={(e) => actualizarCampo(index, "pesoMin", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Peso máximo (kg)"
            value={fila.pesoMax}
            onChange={(e) => actualizarCampo(index, "pesoMax", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <select
            value={fila.tipoServicio}
            onChange={(e) => actualizarCampo(index, "tipoServicio", e.target.value)}
            className="border px-4 py-2 rounded-lg col-span-2 md:col-span-1"
          >
            <option value="">Tipo de servicio</option>
            <option value="express">Express</option>
            <option value="standard">Día siguiente</option>
            <option value="fulfillment">Fulfillment</option>
          </select>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button
          onClick={agregarFila}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Agregar Fila
        </button>

        <button
          onClick={guardarMasivo}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          💾 Guardar todas las tarifas
        </button>
      </div>
    </div>
  );
}
