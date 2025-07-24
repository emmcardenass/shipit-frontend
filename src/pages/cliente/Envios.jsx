import { useEffect, useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";
import PageTransition from "../../shipit-ui/pageTransition";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import GuiaPDF from "../../components/GuiaPDF";

export default function Envios() {
  const [envios, setEnvios] = useState([]);
  const [filtro, setFiltro] = useState({ nombre: "", telefono: "", fecha: "", servicio: "" });
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null);
  const [vista, setVista] = useState("grid");
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    obtenerEnvios();
    const handleEsc = (e) => {
      if (e.key === "Escape") setEnvioSeleccionado(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const obtenerEnvios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnvios(Array.isArray(res.data) ? res.data : res.data.envios || []);
    } catch (error) {
      toast.error("Error al cargar tus envíos");
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const seleccionarTodos = (items) => {
    const ids = items.map((i) => i._id);
    const todosSeleccionados = ids.every((id) => seleccionados.includes(id));
    if (todosSeleccionados) {
      setSeleccionados((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      const nuevos = [...new Set([...seleccionados, ...ids])];
      setSeleccionados(nuevos);
    }
  };

  const handleDescargarSeleccionados = async (ids) => {
    const seleccion = envios.filter((e) => ids.includes(e._id));
    if (!seleccion.length) return toast.error("Selecciona al menos un envío");

    try {
      const blob = await pdf(
        <>{seleccion.map((envio, idx) => <GuiaPDF key={idx} envio={envio} />)}</>
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `guias_seleccionadas.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("Error al generar PDF. Verifica fuentes o imágenes en GuiaPDF.");
    }
  };

  const enviosFiltrados = envios.filter((envio) => {
    const { nombre, telefono, fecha, servicio } = filtro;
    return (
      (!nombre || envio?.destino?.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (!telefono || envio?.destino?.telefono?.includes(telefono)) &&
      (!fecha || new Date(envio.createdAt).toISOString().slice(0, 10) === fecha) &&
      (!servicio || envio?.envio?.tipo === servicio)
    );
  });

  const agrupadosPorDia = enviosFiltrados.reduce((acc, envio) => {
    const fecha = new Date(envio.createdAt).toLocaleDateString("es-MX");
    acc[fecha] = acc[fecha] || [];
    acc[fecha].push(envio);
    return acc;
  }, {});

  return (
    <>
      <PageTransition>
        <div className="card-glass p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Mis Envíos
</h1>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg shadow bg-white dark:bg-zinc-800 border border-gray-300 overflow-hidden">
                <button onClick={() => setVista("grid")} className={`px-3 py-2 text-sm font-medium ${vista === "grid" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>Cuadrícula</button>
                <button onClick={() => setVista("lista")} className={`px-3 py-2 text-sm font-medium ${vista === "lista" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>Lista</button>
              </div>
            </div>
          </div>

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

          {Object.entries(agrupadosPorDia).map(([fecha, items]) => {
            const idsSeleccionadosDelDia = items.map(i => i._id).filter(id => seleccionados.includes(id));
            return (
              <div key={fecha} className="space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{fecha}</h2>
                  <button
                    onClick={() => handleDescargarSeleccionados(idsSeleccionadosDelDia)}
                    className="transition-transform duration-200 ease-in-out hover:scale-[1.03] button-success text-sm px-4 py-2 rounded-lg"
                  >
                    Descargar guías
                  </button>
                </div>
                <button
                  onClick={() => seleccionarTodos(items)}
                  className="text-xs text-blue-600 hover:underline mt-0.5 ml-1"
                >
                  {items.every(item => seleccionados.includes(item._id)) ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>
                <div className={`grid ${vista === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-4 pt-2`}>
                  {items.map((envio) => (
                    <div
                      key={envio._id}
                      className="relative bg-white dark:bg-darkSecondary p-4 rounded-2xl shadow transition-all duration-300 ease-in-out hover:scale-[1.01]"
                      onClick={() => setEnvioSeleccionado(envio)}
                    >
                      <div className="absolute top-3 right-3">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(envio._id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSeleccion(envio._id)}
                          className="accent-blue-600 w-4 h-4"
                        />
                      </div>
                      <p className="text-base font-semibold">{envio?.destino?.nombre || "Sin nombre"}</p>
                      <p className="text-sm text-gray-500">{envio?.destino?.telefono || "Sin teléfono"}</p>
                      <p className="text-sm text-gray-500">{envio?.envio?.tipo || "Sin servicio"}</p>
                      <p className="text-xs text-gray-400">{new Date(envio.createdAt).toLocaleTimeString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PageTransition>

      {envioSeleccionado && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setEnvioSeleccionado(null)}
          tabIndex={0}
        >
          <div
            className="bg-white dark:bg-darkBackground p-8 rounded-2xl shadow-xl w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={() => setEnvioSeleccionado(null)}>✕</button>
            <h2 className="text-xl font-bold mb-4">Detalle del envío</h2>
            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2 mb-4">
              <p><strong>Remitente:</strong> {envioSeleccionado?.origen?.nombre || "—"}</p>
              <p><strong>Tel. Remitente:</strong> {envioSeleccionado?.origen?.telefono || "—"}</p>
              <p><strong>Correo Remitente:</strong> {envioSeleccionado?.origen?.email || "—"}</p>
              <p><strong>Dirección Origen:</strong> {envioSeleccionado?.origen?.direccion || "—"}</p>
              <hr />
              <p><strong>Destinatario:</strong> {envioSeleccionado?.destino?.nombre || "—"}</p>
              <p><strong>Tel. Destinatario:</strong> {envioSeleccionado?.destino?.telefono || "—"}</p>
              <p><strong>Correo Destinatario:</strong> {envioSeleccionado?.destino?.email || "—"}</p>
              <p><strong>Dirección Destino:</strong> {envioSeleccionado?.destino?.direccion || "—"}</p>
            </div>
            <PDFDownloadLink
              document={<GuiaPDF envio={envioSeleccionado} />}
              fileName={`guia-${envioSeleccionado._id}.pdf`}
              className="button-success px-4 py-2 rounded-lg text-sm text-white hover:scale-105 transition"
            >
              Descargar guía en PDF
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </>
  );
}
