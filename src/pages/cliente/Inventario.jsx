// src/pages/Inventario.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../../shipit-ui/pageTransition";
import ResponsiveSection from "../../components/ResponsiveSection"; // ✅ nuevo import

// Si quieres conservar el código actual, lo dejamos comentado:
/*
import { InventoryCard } from "../../components/InventoryCard";
import { StockAlerts } from "../../components/StockAlerts";
import { initialInventory } from "../../utils/inventoryHelpers";
*/

function Inventario() {
  // const [inventario, setInventario] = useState(initialInventory);

  return (
    <PageTransition>
      <ResponsiveSection>
        <motion.div
          className="max-w-4xl mx-auto space-y-6 flex flex-col items-center justify-center text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  ¡Muy pronto!
</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Módulo de Inventario & Fulfillment
          </h2>
          <p className="text-lg text-gray-600 max-w-xl">
            Estamos construyendo una solución avanzada de fulfillment para que puedas enviar tu inventario a nuestros centros y automatizar tus entregas locales y nacionales.
          </p>
          <p className="text-md text-gray-500 max-w-xl">
            Muy pronto podrás gestionar tu inventario directamente desde esta plataforma y disfrutar de envíos <span className="font-semibold text-[#0601FB]">fulfillment con SHIP IT!</span>
          </p>
          <p className="text-sm text-gray-400 italic">
            Módulo exclusivo para clientes registrados. Disponible en próximas actualizaciones. 🚧
          </p>
        </motion.div>
      </ResponsiveSection>
    </PageTransition>
  );
}

export default Inventario;
