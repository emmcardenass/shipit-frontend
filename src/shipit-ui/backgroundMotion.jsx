// src/shipit-ui/backgroundMotion.jsx
import { motion } from "framer-motion";

function BackgroundMotion() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-blue-200 via-white to-pink-200 dark:from-darkBackground dark:via-gray-800 dark:to-darkBackground rounded-full blur-3xl opacity-30"
        initial={{ scale: 1.2, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default BackgroundMotion;
