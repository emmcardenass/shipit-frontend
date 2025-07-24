import { Link, useLocation } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useEffect, useState } from "react";

function Layout({ children }) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setPageTitle("Dashboard");
        break;
      case "/crear-pedido":
        setPageTitle("Crear Pedido");
        break;
      case "/order-detail":
        setPageTitle("Detalle del Pedido");
        break;
      default:
        setPageTitle("");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 fixed w-full z-50 flex justify-between items-center px-8 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-700 dark:text-blue-400 hover:underline">
            SHIP IT!
          </Link>
          <span className="text-lg font-medium">{pageTitle}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`hover:text-blue-600 ${
              location.pathname === "/dashboard" ? "text-blue-700 font-bold" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/crear-pedido"
            className={`hover:text-blue-600 ${
              location.pathname === "/crear-pedido" ? "text-blue-700 font-bold" : ""
            }`}
          >
            Crear Pedido
          </Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="pt-28 px-4 sm:px-8 flex-1">{children}</main>

      {/* Botón flotante para crear pedido */}
      <Link
        to="/crear-pedido"
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg text-lg font-semibold z-40 transition transform hover:scale-105"
      >
        + Nuevo Pedido
      </Link>

      {/* Botón Scroll To Top */}
      <ScrollToTopButton />
    </div>
  );
}

export default Layout;
