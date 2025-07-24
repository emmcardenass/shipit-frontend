// src/pages/RastrearPaquete.jsx
import { useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";
import PageTransition from "../../shipit-ui/pageTransition";
import ResponsiveSection from "../../components/ResponsiveSection";
import {
  PackageSearch,
  PackageCheck,
  Truck,
  Undo2,
  X,
  Check,
} from "lucide-react";

const estados = [
  { key: "creado", label: "Creado", icon: PackageSearch },
  { key: "recolectado", label: "Recolectado", icon: PackageCheck },
  { key: "en_camino", label: "En camino", icon: Truck },
  { key: "entregado", label: "Entregado", icon: Check },
  { key: "reagendado", label: "Reagendado", icon: Undo2 },
  { key: "cancelado", label: "Cancelado", icon: X },
];

export default function RastrearPaquete() {
  const [guia, setGuia] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [indexFinal, setIndexFinal] = useState(-1);

  const rastrear = async () => {
    if (!guia.trim()) return toast.error("Ingresa un número de guía válido");

    setCargando(true);
    setProgreso(0);
    setResultado(null);

    try {
      const res = await axios.get(`/orders/guia/${guia}`);
      const estadoActual = res.data.estado;
      const finalIndex = estados.findIndex((e) => e.key === estadoActual);
      setResultado(res.data);
      setIndexFinal(finalIndex);

      setTimeout(() => {
        let i = 0;
        const intervalo = setInterval(() => {
          setProgreso(i + 1);
          if (i === finalIndex && ["entregado", "cancelado", "reagendado"].includes(estadoActual)) {
            dingSound.play();
          }
          if (i >= finalIndex) clearInterval(intervalo);
          i++;
        }, 500); // 🚀 Más rápido
      }, 300);
    } catch (err) {
      toast.error("No se encontró información para esa guía");
    } finally {
      setCargando(false);
    }
  };

  const renderLineaDeEstado = () => {
    return (
      <div className="relative flex items-center justify-between overflow-x-auto pt-8 px-1">
        {estados.map((estado, index) => {
          const Icon = estado.icon;
          const lineaLlego = index < progreso;
          const iconoActivo = index === progreso - 1;

          let colorClass = "border-gray-300 text-gray-400 bg-white";

          if (index < indexFinal) {
            if (resultado?.estado === "cancelado") {
              if (estado.key === "reagendado") {
                colorClass = "bg-yellow-400 border-yellow-400 text-white";
              } else {
                colorClass = "bg-blue-600 border-blue-600 text-white";
              }
            } else {
              colorClass = "bg-green-500 border-green-500 text-white";
            }
          }
          
          if (index === indexFinal) {
            if (resultado?.estado === "reagendado") {
              colorClass = "bg-yellow-400 border-yellow-400 text-white";
            } else if (resultado?.estado === "cancelado") {
              colorClass = "bg-red-600 border-red-600 text-white";
            } else {
              colorClass = "bg-blue-600 border-blue-600 text-white";
            }
          }          

          const isZoomed = index < progreso;

          return (
            <div key={estado.key} className="flex flex-col items-center text-center w-full relative">
              {index !== 0 && (
                <div className="absolute top-4 -left-1/2 h-1 w-full z-0 bg-gray-300 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all ease-in-out"
                    style={{
                      width: index < progreso ? "100%" : "0%",
                      transitionDuration: "400ms",
                      transitionDelay: `${(index - 1) * 500}ms`,
                    }}
                  />
                </div>
              )}
              <div
                className={`w-9 h-9 z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300`}
                style={{
                  transitionDelay: `${index * 500}ms`,
                  transform: isZoomed ? "scale(1.25)" : "scale(1)",
                  backgroundColor:
                    lineaLlego || iconoActivo
                      ? colorClass.includes("bg-blue-600")
                        ? "#2563EB"
                        : colorClass.includes("bg-green-500")
                        ? "#22C55E"
                        : colorClass.includes("bg-yellow-400")
                        ? "#FACC15"
                        : colorClass.includes("bg-red-600")
                        ? "#DC2626"
                        : "#FFF"
                      : "#FFF",
                  borderColor:
                    lineaLlego || iconoActivo
                      ? colorClass.includes("border-blue-600")
                        ? "#2563EB"
                        : colorClass.includes("border-green-500")
                        ? "#22C55E"
                        : colorClass.includes("border-yellow-400")
                        ? "#FACC15"
                        : colorClass.includes("border-red-600")
                        ? "#DC2626"
                        : "#D1D5DB"
                      : "#D1D5DB",
                  color: lineaLlego || iconoActivo ? "#FFF" : "#9CA3AF",
                }}
              >
                <Icon />
              </div>
              <span
                className={`mt-2 text-[11px] leading-tight w-[72px] transition-all`}
                style={{
                  transitionDelay: `${index * 500}ms`,
                  fontWeight: iconoActivo ? "bold" : "normal",
                  color: iconoActivo ? "#2563EB" : "#6B7280",
                }}
              >
                {estado.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <PageTransition>
      <ResponsiveSection>
        <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Rastrear Paquete
</h1>
          <div className="flex gap-2">
          <input
  type="text"
  value={guia}
  onChange={(e) => setGuia(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") rastrear();
  }}
  placeholder="Ej. SHIP-MTY-00000ABC"
  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
            <button
              onClick={rastrear}
              disabled={cargando}
              className="button-primary px-4 py-2 rounded-lg"
            >
              {cargando ? "Buscando..." : "Rastrear"}
            </button>
          </div>

          {resultado && (
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xl font-semibold text-blue-600">📦 Detalles del Envío</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
  <div>
    <p className="text-gray-500 font-medium">Remitente</p>
    <p>{resultado.origen?.nombre || "—"}</p>
  </div>
  <div>
    <p className="text-gray-500 font-medium">Destinatario</p>
    <p>{resultado.destino?.nombre || "—"}</p>
  </div>
  <div>
    <p className="text-gray-500 font-medium">Dirección</p>
    <p>{resultado.destino?.direccion || "—"}</p>
  </div>
  <div>
    <p className="text-gray-500 font-medium">Teléfono</p>
    <p>{resultado.destino?.telefono || "—"}</p>
  </div>
  <div>
    <p className="text-gray-500 font-medium">Tipo de envío</p>
    <p>{resultado.envio?.tipo || "—"}</p>
  </div>
  <div>
    <p className="text-gray-500 font-medium">Estado</p>
    <p className="font-bold text-blue-700">{resultado.estado || "—"}</p>
  </div>
</div>

              <div className="mt-4">
                <h3 className="text-sm text-gray-500 mb-2">Seguimiento del Envío</h3>
                {renderLineaDeEstado()}
              </div>
            </div>
          )}
        </div>
      </ResponsiveSection>
    </PageTransition>
  );
}
