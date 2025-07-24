// src/components/ResponsiveSection.jsx
import { useEffect, useState } from "react";

export default function ResponsiveSection({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const estado = localStorage.getItem("sidebarOpen");
    setSidebarOpen(estado !== "false");
  }, []);

  return (
    <div
      className={`transition-all duration-300 px-4 md:px-8 ${
        sidebarOpen ? "pl-72" : "pl-20"
      } py-6`}
    >
      <div className="max-w-5xl bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-10 mx-auto">
        {children}
      </div>
    </div>
  );
}
