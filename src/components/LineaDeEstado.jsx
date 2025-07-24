// src/components/LineaDeEstado.jsx
import React from "react";
import { Clock, Truck, XCircle, Check } from "lucide-react";

const estados = [
  { key: "creado", label: "Pedido creado", icon: Clock },
  { key: "recolectado", label: "Recolectado", icon: Check },
  { key: "en_camino", label: "En camino", icon: Truck },
  { key: "entregado", label: "Entregado", icon: Check },
  { key: "reagendado", label: "Reagendado", icon: Clock },
  { key: "cancelado", label: "Cancelado", icon: XCircle },
];

export default function LineaDeEstado({ progreso, indexFinal, estadoActual }) {
  return (
    <div className="flex items-center justify-between relative w-full overflow-x-auto pt-6 px-1 md:px-4">
      {estados.map((estado, index) => {
        const Icon = estado.icon;

        const lineaAvanzando = index < progreso; // la línea ya llegó aquí
        const iconoActivo = index === progreso; // justo el ícono actual a activarse

        let colorClass = "border-gray-300 text-gray-400 bg-white";

        if (index < indexFinal) {
          colorClass = "bg-green-500 border-green-500 text-white";
        }              

        if (index === indexFinal) {
          if (estadoActual === "reagendado") {
            colorClass = "bg-yellow-400 border-yellow-400 text-white";
          } else if (estadoActual === "cancelado") {
            colorClass = "bg-red-600 border-red-600 text-white";
          } else {
            colorClass = "bg-blue-600 border-blue-600 text-white";
          }
        }

        return (
          <div key={estado.key} className="flex flex-col items-center w-full relative">
            {/* Línea azul entre íconos */}
            {index !== 0 && (
              <div className="absolute top-4 -left-1/2 h-1 w-full z-0 bg-gray-300 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: lineaAvanzando ? "100%" : "0%",
                    transitionDuration: "1000ms",
                    transitionDelay: `${(index - 1) * 1000}ms`,
                  }}
                />
              </div>
            )}

            <div
              className={`w-9 h-9 z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300`}
              style={{
                transitionDelay: `${index * 1000}ms`,
                transform: iconoActivo ? "scale(1.25)" : "scale(1)",
                borderColor: lineaAvanzando || iconoActivo ? colorClass.split(" ")[1].replace("border-", "#") : "#D1D5DB", // fallback gray-300
                backgroundColor: lineaAvanzando || iconoActivo ? colorClass.includes("bg-") ? colorClass.split(" ")[0].replace("bg-", "#") : "#FFF" : "#FFF",
                color: lineaAvanzando || iconoActivo ? "#FFF" : "#9CA3AF", // fallback gray-400
              }}
            >
              <Icon size={18} />
            </div>

            <span
              className={`mt-2 text-[11px] text-center leading-tight w-[72px] transition-all`}
              style={{
                transitionDelay: `${index * 1000}ms`,
                fontWeight: iconoActivo ? "bold" : "normal",
                color: iconoActivo ? "#2563EB" : "#6B7280", // azul-600 o gris-500
              }}
            >
              {estado.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
