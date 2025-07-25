import { useNavigate } from "react-router-dom";

export default function LandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden font-sans">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white flex justify-between items-center px-4 py-3 shadow-md">
        <img src="/1.png" alt="SHIP IT Logo" className="h-8 w-auto object-contain" />
        <button
          className="text-sm font-bold text-white bg-[#0601FB] hover:bg-[#0601FB]/90 px-4 py-2 rounded-full transition duration-300"
          onClick={() => navigate("/login")}
        >
          Dashboard
        </button>
      </header>

      {/* HERO */}
      <section id="inicio" className="h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <h1 className="text-4xl font-black text-[#0601FB] leading-tight">
          ¡Vendiste? Ahora SHIP IT!
        </h1>
        <p className="mt-4 text-base text-gray-700">
          Entrega tus productos el mismo día, con opción de Cobro Contra Entrega y seguimiento en tiempo real.
        </p>
        <button
          onClick={() => navigate("/registro")}
          className="mt-8 bg-[#FF7925] text-white text-base px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition"
        >
          Crea tu cuenta
        </button>
      </section>

      {/* Puedes continuar con más secciones aquí si lo deseas */}
    </div>
  );
}
