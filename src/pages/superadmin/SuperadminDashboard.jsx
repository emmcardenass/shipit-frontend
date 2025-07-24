// src/pages/superadmin/SuperadminDashboard.jsx
import { useState } from "react";
import SidebarSuperadmin from "../../components/SidebarSuperadmin";
import Tarifas from "./Tarifas";
import PanelGeneral from "./PanelGeneral";
import Usuarios from "./Usuarios";
import Pedidos from "./Pedidos";
import Repartidores from "./Repartidores";
import Estadisticas from "./Estadisticas";
import Integraciones from "./Integraciones";
import Finanzas from "./Finanzas";
import Seguridad from "./Seguridad";
import NovaIA from "./NovaIA";
import Inventario from "./Inventario";
import SolicitudesRetiro from "./SolicitudesRetiro";
import TarifasCliente from "./TarifasCliente";
import SolicitudesRecarga from "./SolicitudesRecarga";
import Recolecciones from "@/pages/superadmin/Recolecciones";
import Entregas from "@/pages/superadmin/Entregas";

export default function SuperadminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const nombreUsuario = "Emmanuel Cárdenas";
  const fotoUsuario = "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "recolecciones":
        return <Recolecciones />;
      case "entregas":
        return <Entregas />;
      case "dashboard":
        return <PanelGeneral />;
      case "usuarios":
        return <Usuarios />;
      case "recargas":
        return <SolicitudesRecarga />;
        case "tarifas":
          return <Tarifas />;
        case "retiros":
          return <SolicitudesRetiro />;        
      case "tarifas-cliente":
        return <TarifasCliente />;
      case "pedidos":
        return <Pedidos />;
      case "repartidores":
        return <Repartidores />;
      case "inventario":
        return <Inventario />;
      case "estadisticas":
        return <Estadisticas />;
      case "integraciones":
        return <Integraciones />;
      case "finanzas":
        return <Finanzas />;
      case "seguridad":
        return <Seguridad />;
      case "nova":
        return <NovaIA />;
      default:
        return <div>Selecciona una sección</div>;
    }
  };  

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-all duration-300">
      <SidebarSuperadmin
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nombreUsuario={nombreUsuario}
        fotoUsuario={fotoUsuario}
        handleLogout={handleLogout}
      />
      <div
        className={`transition-all duration-300 flex-1 p-4 md:p-6 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
