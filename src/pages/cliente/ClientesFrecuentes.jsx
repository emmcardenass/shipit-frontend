// src/pages/cliente/ClientesFrecuentes.jsx
import { useEffect, useState } from "react";
import axios from "@/axios";
import { Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageTransition from "../../shipit-ui/pageTransition";
import AutocompleteDireccion from "../../components/AutocompleteDireccion";
import { motion } from "framer-motion";

export default function ClientesFrecuentes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "", direccion: "", email: "" });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch (err) {
      toast.error("Error al cargar clientes frecuentes");
    }
  };

  const guardarCliente = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion?.direccion || form.direccion,
        email: form.email
      };

      if (editando) {
        await axios.put(`clientes/${editando}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cliente actualizado");
      } else {
        await axios.post("/clientes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cliente guardado");
      }

      setForm({ nombre: "", telefono: "", direccion: "", email: "" });
      setEditando(null);
      cargarClientes();
    } catch (err) {
      toast.error("Error al guardar cliente");
    }
  };

  const eliminarCliente = async (id) => {
    const confirmacion = confirm("¿Seguro que quieres eliminar este cliente?");
    if (!confirmacion) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cliente eliminado");
      cargarClientes();
    } catch (err) {
      toast.error("Error al eliminar cliente");
    }
  };

  const editarCliente = (cliente) => {
    setForm({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      email: cliente.email || ""
    });
    setEditando(cliente._id);
  };

  return (
    <PageTransition>
      <div className="pt-24 px-6">
        <motion.div
          className="card-glass max-w-4xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Clientes Frecuentes
</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="input-style"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="input-style"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <AutocompleteDireccion
              value={{ direccion: form.direccion }}
              onChange={(val) => setForm({ ...form, direccion: val.direccion })}
              placeholder="Dirección"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="input-style"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <button
            onClick={guardarCliente}
            className="button-success flex items-center gap-2 w-full justify-center"
          >
            <Plus size={16} /> {editando ? "Actualizar cliente" : "Agregar cliente"}
          </button>

          <div>
            {clientes.length === 0 ? (
              <p className="text-gray-500 text-center">No hay clientes frecuentes aún.</p>
            ) : (
              <div className="grid gap-4">
                {clientes.map((cliente) => (
                  <div
                    key={cliente._id}
                    className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{cliente.nombre}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {cliente.telefono} | {cliente.direccion}
                      </p>
                      {cliente.email && <p className="text-sm italic text-gray-500">{cliente.email}</p>}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => editarCliente(cliente)}>
                        <Edit className="text-blue-600" />
                      </button>
                      <button onClick={() => eliminarCliente(cliente._id)}>
                        <Trash2 className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
