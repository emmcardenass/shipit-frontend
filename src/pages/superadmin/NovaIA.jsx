// src/pages/superadmin/NovaCopiloto.jsx
import { Bot, MessageCircle, Lightbulb, Activity } from "lucide-react";

export default function NovaCopiloto() {
  const sugerencias = [
    {
      titulo: "Clientes en Riesgo",
      detalle: "Detectamos 3 clientes que no han hecho pedidos en 20 días.",
      icono: <Activity size={22} />,
    },
    {
      titulo: "Zona Saturada",
      detalle: "La zona 'Cumbres Poniente' está excediendo el 85% de capacidad operativa.",
      icono: <Lightbulb size={22} />,
    },
    {
      titulo: "Optimización de Tarifas",
      detalle: "Podrías subir $5 la tarifa de 'Mitras Norte' sin perder competitividad.",
      icono: <Lightbulb size={22} />,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Bot size={32} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Nova Copiloto Ejecutivo
          </h2>
        </div>

        {/* Zona de sugerencias inteligentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sugerencias.map((sugerencia, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/70 dark:bg-gray-800/50 p-5 shadow-md flex items-start gap-4"
            >
              <div className="p-3 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-white shadow-inner">
                {sugerencia.icono}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {sugerencia.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {sugerencia.detalle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat con Nova (placeholder) */}
        <div className="mt-10 p-6 bg-white/60 dark:bg-gray-900/40 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <MessageCircle size={20} /> Pregúntale a Nova:
          </h3>
          <input
            type="text"
            placeholder="Ej: ¿Cómo vamos esta semana?"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 dark:bg-gray-800/60 text-gray-900 dark:text-white"
          />
          <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
            Pronto podrás interactuar con una IA contextual entrenada con tus datos reales.
          </p>
        </div>
      </div>
    </div>
  );
}
