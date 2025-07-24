// src/components/BotonPremium.jsx
import { motion } from "framer-motion";

function BotonPremium({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold shadow-sm transition duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default BotonPremium;
