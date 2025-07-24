import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

function Navbar() {
  const location = useLocation();

  const linkClasses = (path) =>
    location.pathname === path
      ? "text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-300"
      : "text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-300";

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-darkBackground shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className={linkClasses("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/cotizador" className={linkClasses("/cotizador")}>
          Cotizador
        </Link>
        <Link to="/crear-pedido" className={linkClasses("/crear-pedido")}>
          Crear Pedido
        </Link>
        <Link to="/inventario" className={linkClasses("/inventario")}>
          Inventario
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">Modo</span>
        <DarkModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
