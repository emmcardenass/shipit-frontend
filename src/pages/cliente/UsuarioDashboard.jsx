// src/pages/cliente/UsuarioDashboard.jsx
import { useState, useEffect } from "react";
import axios from "@/axios";
import CrearPedido from "./CrearPedido";
import Cotizador from "./Cotizador";
import Inventario from "./Inventario";
import Historial from "./Historial";
import PerfilCliente from "./PerfilCliente";
import ClientesFrecuentes from "./ClientesFrecuentes";
import Billetera from "./Billetera";
import Envios from "./Envios";
import RastrearPaquete from "./RastrearPaquete";
import Apis from "./Apis";
import Nova from "./Nova";
import Nitro from "./Nitro";
import { motion, AnimatePresence } from "framer-motion";
import SidebarUsuario from "../../components/SidebarUsuario";
import { useMemo } from "react";

export default function UsuarioDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("ultimaSeccionCliente") || "crear";
  });  
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [fotoUsuario, setFotoUsuario] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("sidebarOpen") !== "false";
  });

const frasesMotivadoras = [
  "“¿Tienes miedo? Pues hazlo con miedo, pero hazlo.” — Emmanuel Cárdenas 🚀",
  "“¡Me siento uf, uf y re-contra uf! Estamos al millón.” — Ramón Gutiérrez Hernández 🔥",
  "“A donde vayas se el mejor, con los pies en la tierra y agradecido con Dios.” — Wendy Gutiérrez 🎯",
  "“Las cosas se hacen bien o no se hacen.” — Manuel Cárdenas ⚖️",
  "“Sigue y no te rindas hasta alcanzar el éxito.” — Frida Cárdenas ⚖️",
  "“Cree en ti, confía en ti, sueña en grande.” — Arleth Ruelas 🧠",
  "“El futuro pertenece a quienes creen en la belleza de sus sueños.” — Eleanor Roosevelt ✨",
  "“No esperes. El tiempo nunca será justo.” — Napoleon Hill ⏳",
  "“Las oportunidades no ocurren. Tú las creas.” — Chris Grosser 🛠️",
  "“El poder no te lo dan. Tienes que tomarlo.” — Beyoncé Knowles-Carter 👑",
  "“Los emprendedores fallan, se caen, pero no se rinden.” — N.O.V.A. 💪",
  "“El mayor riesgo es no tomar ninguno.” — Mark Zuckerberg 🎯",
  "“Convierte tus heridas en sabiduría.” — Oprah Winfrey 🧠",
  "“No tienes que ser grande para comenzar, pero debes comenzar para ser grande.” — Zig Ziglar 🚀",
  "“No busques la validación en otros. Valídate a ti mismo cada vez que decidas seguir tu pasión.” — Issa Rae 🌱",
  "“La innovación distingue a un líder de un seguidor.” — Steve Jobs 💡",
  "“Cree que puedes y ya estás a medio camino.” — Theodore Roosevelt 🛤️",
  "“A veces perder es lo que necesitas para ganar más grande.” — Denzel Washington 🎬",
  "“No se trata de tener ideas. Se trata de hacerlas realidad.” — Scott Belsky 🎨",
  "“No hay pasión en jugar pequeño y conformarse con una vida menor a la que eres capaz de vivir.” — Nelson Mandela 🔓",
  "“Hoy es el único día que tienes. Haz que valga la pena.” — Oprah Winfrey 🌞",
  "“No importa cuántas veces falles, solo necesitas acertar una vez.” — Mark Cuban 🏀",
  "“Tú tienes el permiso de empezar incluso antes de sentirte listo.” — Mel Robbins 🏁",
  "“Haz de tu vida un sueño, y de tu sueño una realidad.” — Antoine de Saint-Exupéry 🌌",
  "“Tu límite es solo el que tú aceptes.” — N.O.V.A. ⛰️",
  "“Si puedes soñarlo, puedes lograrlo.” — Walt Disney 🏰",
  "“En medio de la dificultad yace la oportunidad.” — Albert Einstein 🧬",
  "“Trabaja en silencio y deja que tu éxito haga el ruido.” — Frank Ocean 🔊",
  "“Haz que suceda. Nadie lo hará por ti.” — N.O.V.A. 🛤️",
  "“Levántate con determinación. Acuéstate con satisfacción.” — Anónimo ☀️",
  "“Un emprendedor ve oportunidades donde otros ven obstáculos.” — Michael Gerber 🔎",
  "“Lo imposible solo tarda un poco más.” — N.O.V.A. ⏱️",
  "“El dolor es temporal. El orgullo es para siempre.” — Muhammad Ali 🥊",
  "“Todo logro empieza con la decisión de intentarlo.” — Gail Devers 🛫",
  "“Sueña en grande y atrévete a fallar.” — Norman Vaughan 🌠",
  "“Nunca sabrás de lo que eres capaz hasta que lo intentes.” — N.O.V.A. 🧗",
  "“El éxito es la suma de pequeños esfuerzos repetidos cada día.” — Robert Collier 📈",
  "“Tu voz tiene poder. Úsala.” — Viola Davis 🎤",
  "“Lo que no se empieza hoy, nunca se termina mañana.” — Johann Wolfgang von Goethe 🗓️",
  "“La disciplina tarde o temprano vencerá al talento.” — N.O.V.A. ⏱️",
  "“Levántate y brilla. El mundo espera lo mejor de ti.” — N.O.V.A. ☀️",
  "“No nacimos para quedarnos quietos.” — N.O.V.A. 🏃‍♂️",
  "“Ser tú mismo es el acto más valiente que puedes hacer.” — Maya Angelou 🦋",
  "“Si luchas por lo que amas, ya estás ganando.” — Anónimo ❤️",
  "“La mejor forma de predecir el futuro es creándolo.” — Peter Drucker 🔮",
  "“Los límites solo existen en tu mente.” — N.O.V.A. 🧠",
  "“A veces los sueños se ven como locura, hasta que se cumplen.” — N.O.V.A. 🤯",
  "“En ti está la semilla del cambio que el mundo necesita.” — N.O.V.A. 🌍",
  "“Construye una vida que no necesite vacaciones.” — N.O.V.A. 🌅",
  "“El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.” — Albert Schweitzer 😊",
  "“Hazlo con amor, o no lo hagas.” — N.O.V.A. 💖",
  "“Una idea es solo un sueño hasta que decides actuar.” — N.O.V.A. ✍️",
  "“Tienes más fuerza de la que imaginas.” — N.O.V.A. 🧩",
];

const fraseAleatoria = useMemo(() => {
  const index = Math.floor(Math.random() * frasesMotivadoras.length);
  return frasesMotivadoras[index];
}, []);

  useEffect(() => {
    localStorage.setItem("ultimaSeccionCliente", activeTab);
  }, [activeTab]);  

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });        

        const user = response.data;
        setNombreUsuario(user.name || "Usuario");
        setFotoUsuario(user.foto || "");

        // Guardar como caché
        localStorage.setItem("usuario", JSON.stringify({
          name: user.name,
          role: user.role,
          foto: user.foto,
        }));
      } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        window.location.href = "/";
      }
    };

    fetchUserProfile();
    setTimeout(() => {
      setCargandoInicial(false);
    }, 5000);    
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", newState);
  };

  const renderSection = () => {
    switch (activeTab) {
      case "crear":
        return <CrearPedido />;
      case "cotizar":
        return <Cotizador />;
      case "inventario":
        return <Inventario />;
      case "historial":
        return <Historial />;
      case "perfil":
        return <PerfilCliente setFotoUsuario={setFotoUsuario} />;
      case "clientes":
        return <ClientesFrecuentes />;
      case "billetera":
        return <Billetera />;
      case "envios":
        return <Envios />;
      case "rastrear":
        return <RastrearPaquete />;
      case "apis":
        return <Apis />;
      case "nova":
        return <Nova />;
      case "nitro":
        return <Nitro />;
      default:
        return <p className="text-center text-gray-500">Selecciona una opción del menú.</p>;
    }
  };

  if (cargandoInicial) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-center space-y-4">
        <img
  src="/logo-pulso.png"
  alt="Cargando..."
  className="w-32 h-auto mx-auto animate-pulse-scale"
/>
          <p className="text-zinc-600 dark:text-white animate-pulse font-semibold tracking-wide">
            Cargando tu experiencia...
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-300 italic max-w-md mx-auto mt-2 animate-fadeIn text-center">
  {fraseAleatoria}
</p>
        </div>
      </div>
    );
  }  

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* HEADER PANEL CON GLASS PREMIUM CENTRADO */}
<header
  className={`fixed top-0 transition-all duration-300 z-50 flex justify-center items-center px-6 ${
    sidebarOpen ? "left-64" : "left-20"
  } right-0 h-[80px]`}
>
  
  {/* Contenedor principal Glass */}
  <div className="flex justify-center items-center w-full max-w-6xl backdrop-blur-lg border border-white/30 rounded-full shadow-2xl relative overflow-hidden p-0 bg-gradient-to-r from-blue-600/30 via-white/10 to-orange-500/30 px-4 py-2">
    
    {/* Logo al centro */}
    <img src="/12.png" alt="SHIP IT Logo" className="h-10 w-auto object-contain" />

  </div>

</header>

      {/* 🔵 Fondo decorativo glassmorphism */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none pt-16">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#0066FF] blur-[120px] opacity-30" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[#FF2D95] blur-[120px] opacity-30" />
        <svg
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-[500px] h-[500px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-10"
        >
          <rect x="150" y="150" width="80" height="80" rx="8" fill="#ffffff" />
          <rect x="160" y="160" width="60" height="60" rx="4" fill="#0066FF" opacity="0.4" />
          <rect x="250" y="200" width="100" height="60" rx="6" fill="#ffffff" />
          <rect x="260" y="210" width="80" height="40" rx="4" fill="#FF2D95" opacity="0.4" />
          <path
            d="M350 250c0 33-30 70-30 70s-30-37-30-70a30 30 0 1 1 60 0z"
            fill="#ffffff"
          />
          <circle cx="350" cy="250" r="10" fill="#0066FF" />
        </svg>
      </div>

      {/* 🧠 Layout principal */}
      <div className="flex bg-transparent text-gray-900 dark:text-white pt-16">
        <SidebarUsuario
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          nombreUsuario={nombreUsuario}
          fotoUsuario={fotoUsuario}
          handleLogout={handleLogout}
        />

        <main
          className={`flex-1 p-6 md:p-10 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
