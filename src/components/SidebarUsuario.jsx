import {
  PackagePlus,
  Boxes,
  Notebook,
  UserCircle,
  Clock,
  LogOut,
  ChevronRight,
  Users,
  Wallet,
  Search,
  Server,
  Bot,
  Warehouse,
  Calculator,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/axios";

const tabs = [
  { label: "Mi Perfil", value: "perfil", icon: <UserCircle /> },
  { label: "Billetera", value: "billetera", icon: <Wallet /> },
  { label: "Crear Envío", value: "crear", icon: <PackagePlus /> },
  { label: "Mis Envíos", value: "envios", icon: <Boxes /> },
  { label: "Inventario", value: "inventario", icon: <Warehouse /> },
  { label: "Clientes Frecuentes", value: "clientes", icon: <Users /> },
  { label: "Rastrear Paquete", value: "rastrear", icon: <Search /> },
  { label: "Historial", value: "historial", icon: <Clock /> },
  { label: "Cotizador", value: "cotizar", icon: <Calculator /> },
  { label: "APIs", value: "apis", icon: <Server /> },
  { label: "¡NOVA te ayuda!", value: "nova", icon: <Bot /> },
  { label: "NITRO", value: "nitro", icon: <Zap /> },
];

export default function SidebarUsuario({
  sidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  nombreUsuario,
  fotoUsuario,
  handleLogout
}) {

  const [saldo, setSaldo] = useState(0); // 👈 saldo

  useEffect(() => {
    const obtenerSaldo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });        
        setSaldo(res.data.saldo || 0);
      } catch (error) {
        console.error("❌ Error al obtener perfil en Sidebar:", error);
      }
    };

    obtenerSaldo();
  }, []);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } h-screen fixed top-0 left-0 z-50 bg-gray-100 dark:bg-gray-800 shadow-xl flex flex-col transition-all duration-300`}
    >
      {/* Encabezado */}
      <div className="px-4 pt-6 pb-4">
        <div className="mb-6 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-md bg-blue-600 flex items-center justify-center text-white text-lg font-bold mx-auto">
            {fotoUsuario ? (
              <img
                src={fotoUsuario}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              nombreUsuario.charAt(0).toUpperCase()
            )}
          </div>
          {sidebarOpen && (
            <div className="ml-4">
              <p className="text-sm text-gray-400">Bienvenido</p>
              <p className="font-semibold text-sm">{nombreUsuario}</p>
              {/* 👇 saldo debajo del nombre */}
              <p className="text-xs font-semibold mt-1" style={{ color: '#0601FB' }}>
  Saldo: ${saldo} MXN
</p>
            </div>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div
        className={`flex-1 px-2 overflow-y-auto ${
          sidebarOpen ? '' : 'scrollbar-hidden'
        }`}
      >
        <nav className="space-y-4 flex flex-col items-center justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`w-full py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-0 ${
                activeTab === tab.value
  ? "bg-[#0601FB] text-white"
  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <div
                className={`flex items-center w-full ${
                  sidebarOpen ? "justify-start space-x-2 px-3" : "justify-center"
                }`}
              >
                <span>{tab.icon}</span>
                {sidebarOpen && <span>{tab.label}</span>}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Botón de logout */}
      <div className="px-2 py-4">
        <button
          onClick={handleLogout}
          className={`rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 focus:outline-none focus:ring-0 ${
            sidebarOpen
              ? "w-[232px] px-3 py-2"
              : "w-[64px] h-[48px] px-0 py-0"
          }`}
        >
          <div
            className={`flex items-center w-full ${
              sidebarOpen ? "justify-start space-x-2" : "justify-center"
            }`}
          >
            <LogOut className="w-5 h-5 rotate-180" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </div>
        </button>
      </div>

      {/* Botón de colapsar centrado */}
      <div className="absolute top-0 bottom-0 left-full flex items-center justify-center">
        <button
          onClick={toggleSidebar}
          className="w-5 h-20 flex items-center justify-center rounded-r-lg bg-gray-100 dark:bg-gray-800 transition-transform duration-300"
        >
          <div
            className={`transform transition-transform duration-300 ${
              sidebarOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronRight size={20} />
          </div>
        </button>
      </div>
    </aside>
  );
}
