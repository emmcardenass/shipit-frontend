// src/components/StockAlerts.jsx
import { motion } from "framer-motion";

export function StockAlerts({ inventario }) {
  const productosEnRiesgo = inventario.filter(
    (p) => p.estado === "bajo" || p.estado === "nulo" || p.estado === "moderado"
  );

  if (productosEnRiesgo.length === 0) return null;

  return (
    <motion.div
      className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-md mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-lg font-bold mb-2 text-yellow-800 dark:text-yellow-300">
        📋 Productos en riesgo de agotarse:
      </h2>

      <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-200">
        {productosEnRiesgo.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} – Stock: {producto.stock}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
