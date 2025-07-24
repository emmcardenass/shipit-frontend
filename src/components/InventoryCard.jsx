// src/components/InventoryCard.jsx
import { motion } from "framer-motion";

export function InventoryCard({ producto }) {
  const colorStatus = {
    suficiente: "bg-green-100 text-green-800",
    moderado: "bg-yellow-100 text-yellow-800",
    bajo: "bg-red-100 text-red-800",
    nulo: "bg-gray-100 text-gray-800",
  };

  return (
    <motion.div
      className="bg-white dark:bg-darkBackground rounded-2xl shadow-md p-6 flex flex-col space-y-4 hover:scale-105 transition-transform duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold">{producto.nombre}</h2>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-300">Stock:</span>
        <span className={`text-sm font-bold px-2 py-1 rounded-full ${colorStatus[producto.estado]}`}>
          {producto.stock}
        </span>
      </div>

      <div className="flex justify-end">
        <button className="button-success hover-zoom">
          Ver movimientos
        </button>
      </div>
    </motion.div>
  );
}
