import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = "pk.eyJ1Ijoic2hpcGl0bWV4aWNvIiwiYSI6ImNtMGZzMHZ5YjA3dTEyb3B2eng1OW80bWMifQ.jw1dTx1ZKBrD8uNKzCrzjw";


export default function Landing() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);

  useEffect(() => {
    gsap.set(".fade-in", { opacity: 1, y: 0 });
    
    gsap.utils.toArray(".fade-in").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    });
  
    gsap.utils.toArray(".stat-number").forEach((el) => {
      const finalValue = parseInt(el.dataset.final);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
  
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: finalValue,
        duration: 2,
        scrollTrigger: { trigger: el, start: "top 80%" },
        snap: { innerText: 1 },
        ease: "power1.out",
        onUpdate: () => {
          const value = Math.floor(el.innerText).toLocaleString();
          el.innerText = `${prefix}${value}${suffix}`;
        },
      });
    });
  }, []);  
  
  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-100.3161, 25.6866],
        zoom: 11,
        interactive: false, // 🔒 Esto desactiva toda la interacción
      });
  
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([-100.3161, 25.6866])
        .addTo(map);
    }
  }, []);  

  const handleHover = (e, entering) => {
    const btn = e.currentTarget;
    const overlay = btn.querySelector(".overlay-fill");
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    overlay.style.left = `${x}px`;
    overlay.style.top = `${y}px`;

    if (entering) {
      overlay.style.transform = "translate(-50%, -50%) scale(1)";
    } else {
      overlay.style.transform = "translate(-50%, -50%) scale(0)";
    }
  };

  const BotonAnimado = ({ texto, extraClass = "", onClick }) => (
    <button
      className={`relative overflow-hidden bg-[#0601FB] text-white rounded-full text-lg shadow-lg px-8 py-4 hover:scale-105 transition ${extraClass}`}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
      onClick={onClick}
      style={{ position: "relative", zIndex: 1 }}
    >
      {texto}
      <span
        className="overlay-fill absolute bg-orange-500 scale-0 pointer-events-none animate-blob z-0"
        style={{
          width: "600px",
          height: "600px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(0)",
          zIndex: -1,
          borderRadius: "55% 45% 65% 35% / 50% 60% 40% 50%",
          transition: "transform 1s ease",
        }}
      ></span>
    </button>
  );  

  const BotonAnimadoMini = ({ texto, extraClass = "", onClick }) => (
    <button
      className={`relative overflow-hidden bg-blue-600 text-white rounded-full text-base font-semibold shadow-lg px-8 py-4 hover:scale-105 transition ${extraClass}`}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
      onClick={onClick}
      style={{ height: "64px", position: "relative", zIndex: 1 }}
    >
      {texto}
      <span
        className="overlay-fill absolute bg-orange-500 scale-0 pointer-events-none animate-blob z-0"
        style={{
          width: "600px",
          height: "600px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(0)",
          zIndex: -1,
          borderRadius: "55% 45% 65% 35% / 50% 60% 40% 50%",
          transition: "transform 1s ease",
        }}
      ></span>
    </button>
  );  

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden font-sans"> 

      {/* HERO */}
<section id="inicio" className="h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
  <div className="flex flex-col justify-center items-center z-10 transform -translate-y-32">
    <h1 className="hero-title text-6xl md:text-7xl font-black text-[#0601FB] font-[Inter]">
      ¡Vendiste? Ahora SHIP IT!
    </h1>
    <p className="hero-sub mt-6 text-xl md:text-2xl max-w-2xl font-[Inter]">
      Entrega tus productos el mismo día, con opción de Cobro Contra Entrega y seguimiento en tiempo real.
    </p>
    <BotonAnimado
  texto="Comienza gratis"
  extraClass="mt-10 font-[Inter] bg-gradient-to-r from-[#0601FB] to-[#FB8C00] text-white"
  onClick={() => navigate("/registro")}
/>
  </div>

  <div className="absolute bottom-0 w-full flex justify-center">
    <img src="/7.png" alt="SHIP IT Hero" className="max-h-[650px] object-contain" />
  </div>
</section>

      {/* BENEFICIOS */}
<section id="beneficios" className="py-32 bg-gradient-to-r from-blue-100 to-purple-200">
  <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-[Inter]">Beneficios de SHIP IT</h2>

  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8 px-6">

    <div className="fade-in bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-2 font-[Inter]">🚀 Sin mínimos ni suscripciones</h3>
      <p>Empieza a enviar desde 1 solo paquete, sin compromisos.</p>
    </div>

    <div className="fade-in bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-2 font-[Inter]">🏠 Recolectamos en tu domicilio</h3>
      <p>Olvídate de salir, vamos por tus paquetes directo a tu puerta.</p>
    </div>

    <div className="fade-in bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-2 font-[Inter]">🔄 Dos intentos de entrega</h3>
      <p>Si tu cliente no está disponible, lo intentamos de nuevo sin costo adicional.</p>
    </div>

    <div className="fade-in bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-2 font-[Inter]">💵 Pago contra entrega</h3>
      <p>Cobra en efectivo a tus clientes y recibe tu dinero de forma segura.</p>
    </div>

    <div className="fade-in bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-2 font-[Inter]">📦 Servicio de almacenamiento</h3>
      <p>Guarda tu inventario y despacha desde nuestros centros logísticos.</p>
    </div>

    <div className="fade-in bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-2 font-[Inter]">🌙 Crea envíos 24/7</h3>
      <p>Tu panel está disponible siempre, programa pedidos en cualquier momento.</p>
    </div>

  </div>
</section>

      {/* TARIFAS */}
      <section id="tarifas" className="py-24 flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
  <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-[Inter]">Tarifas Simples</h2>

  <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6">

    <div className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 p-8 rounded-xl shadow-xl text-center">
      <h3 className="text-2xl font-bold mb-4">Mismo Día</h3>
      <p className="text-4xl font-bold mb-6"> Desde $90 MXN</p>
      <p>Recolectamos y entregamos tus paquetes el mismo día.</p>
    </div>

    <div className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 p-8 rounded-xl shadow-xl text-center">
      <h3 className="text-2xl font-bold mb-4">Día Siguiente</h3>
      <p className="text-4xl font-bold mb-6"> Desde $60 MXN</p>
      <p>Para envíos programados al día siguiente.</p>
    </div>

    <div className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 p-8 rounded-xl shadow-xl text-center">
      <h3 className="text-2xl font-bold mb-4">Fulfillment</h3>
      <p className="text-4xl font-bold mb-6"> Desde $85 MXN</p>
      <p>Almacenamiento y envíos automatizados para tu tienda el mismo día.</p>
    </div>

    <div className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 p-8 rounded-xl shadow-xl text-center">
      <h3 className="text-2xl font-bold mb-4">Dedicado</h3>
      <p className="text-4xl font-bold mb-6">Soluciones A Medida</p>
      <p>Soluciones empresariales y rutas dedicadas.</p>
    </div>

  </div>
</section>

      {/* COBERTURA */}
<section id="cobertura" className="py-24 flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
  
  <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[Inter]">Cobertura en Nuevo León</h2>
  <p className="max-w-xl mx-auto mb-8">Entregamos en Monterrey y su Zona Metropolitana. San Pedro, Guadalupe, San Nicolás, Apodaca, Escobedo, Santa Catarina, Juárez, García, Santiago y seguimos creciendo.</p>
  
  <div className="relative mx-auto max-w-4xl w-full h-[400px] rounded-xl overflow-hidden shadow-xl flex justify-center items-center">
    <div ref={mapContainer} className="w-full h-full" />

  </div>

  {/* Imagen decorativa posicionada dentro, más controlada */}
  <img 
      src="/8.png" 
      alt="Cobertura Gráfica" 
      className="absolute right-[-9.2%] top-1/2 transform -translate-y-1/2 max-h-[400px] object-contain pointer-events-none select-none hidden md:block"
    />

</section>

      {/* SECCIÓN CASH ON DELIVERY DETALLADA */}
<section className="py-32 bg-white text-gray-800 text-center relative overflow-hidden">

{/* Imagen izquierda */}
<img 
  src="/9.png" 
  alt="Decoración COD" 
  className="absolute left-[5%] top-[50%] transform -translate-y-1/2 w-auto max-w-none h-auto max-h-[600px] pointer-events-none select-none z-0"
/>

{/* Imagen derecha */}
<img 
  src="/9.png" 
  alt="Decoración COD" 
  className="absolute right-[5%] top-[80%] transform -translate-y-1/2 w-auto max-w-none h-auto max-h-[700px] pointer-events-none select-none z-0"
/>

{/* Título al frente */}
<h2 className="text-4xl md:text-5xl font-bold mb-12 font-[Inter] relative z-10">
  ¿Qué es Cash on Delivery?
</h2>

{/* Contenedor Glass al frente */}
<div className="max-w-4xl mx-auto px-6 relative z-10">
  
  <div className="backdrop-blur-lg bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 rounded-3xl shadow-2xl p-10">
    
    <p className="mb-6 text-lg leading-relaxed">
      Cash on Delivery (COD) significa que tu cliente paga su pedido justo al momento de recibirlo. Con <strong>SHIP IT!</strong> no tienes que arriesgarte a que el cliente no pague, nosotros recolectamos el efectivo por ti y te lo transferimos de manera segura.
    </p>

    <p className="mb-6 text-lg leading-relaxed">
      Es ideal para generar más ventas, especialmente con personas que no confían en los pagos en línea. Tú vendes, <strong>SHIP IT!</strong> entrega y cobra, todo en un mismo flujo sin complicaciones.
    </p>

    <p className="text-lg leading-relaxed">
      Además, tienes <strong>seguimiento en tiempo real</strong> de tu entrega y notificaciones al instante cuando se realiza el cobro exitosamente.
    </p>
  
  </div>

</div>

</section>

{/* SECCIÓN ESTADÍSTICAS */}
<section className="py-32 bg-white text-center text-gray-800">
  <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por qué confiar en nosotros?</h2>
  <p className="mb-12 text-lg max-w-2xl mx-auto">Con más de 5 años de experiencia estamos listos para ofrecerte el mejor servicio en mensajería local.</p>

  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    <div className="fade-in">
      <p className="text-6xl text-[#0601FB] font-black stat-number" data-final="500" data-prefix="+">0</p>
      <p className="mt-2 font-semibold">Clientes activos por mes</p>
    </div>
    <div className="fade-in">
      <p className="text-6xl text-[#0601FB] font-black stat-number" data-final="12000" data-prefix="+">0</p>
      <p className="mt-2 font-semibold">Paquetes enviados por mes</p>
    </div>
    <div className="fade-in">
      <p className="text-6xl text-[#0601FB] font-black stat-number" data-final="97" data-suffix="%">0%</p>
      <p className="mt-2 font-semibold">Entregas realizadas con éxito</p>
    </div>
  </div>
</section>

      {/* SECCIÓN NITRO */}
      <section className="py-40 bg-gradient-to-r from-blue-100 to-purple-200 text-center text-gray-900 relative overflow-hidden">
  
  <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight font-[Inter]">NITRO</h2>
  
  <p className="max-w-3xl mx-auto text-xl md:text-2xl mb-10 opacity-90">
    La solución más rápida que hayas visto. En breve, los envíos en Nuevo León alcanzarán una nueva dimensión.
  </p>

  <p className="text-purple-600 uppercase tracking-widest mb-2 font-semibold">Próximamente</p>
  
  <h3 className="text-3xl font-semibold mb-10">Prepárate para un servicio ultrarrápido.</h3>

  <BotonAnimado texto="Conoce antes que nadie" extraClass="mt-6" onClick={() => navigate("/registro")} />
  
</section>

{/* SECCIÓN TESTIMONIOS */}
<section id="testimonios" className="py-32 bg-gradient-to-r from-blue-100 to-purple-200 text-center">
  <h2 className="text-4xl md:text-5xl font-bold mb-10 font-[Inter]">Lo que dicen nuestros clientes</h2>

  <div className="overflow-x-auto hide-scrollbar">
    <div className="flex space-x-6 px-6 w-max">
      {[
        {
          texto: "El servicio de paquetería mas eficiente, práctico y seguro que hemos utilizado, sin duda son los mejores.",
          autor: "Arleth Ruelas",
          empresa: "Lúmea",
        },
        {
          texto: "SHIP IT! entrega todo en tiempo y forma, nuestros clientes jamás habían estado, ahora compran y reciben el mismo día",
          autor: "Emanuel Figueroa",
          empresa: "SnkcrsClub",
        },
        {
          texto: "Los repartidores son súper puntuales y profesionales, nuestros clientes están encantados.",
          autor: "Paola Hernández",
          empresa: "Floristería Bella Flor",
        },
        {
          texto: "El sistema de Cash on Delivery nos permitió aumentar las ventas en efectivo sin riesgos.",
          autor: "Ricardo Álvarez",
          empresa: "Tecnología Express",
        },
        {
          texto: "Excelente atención, siempre disponibles para resolver nuestras dudas.",
          autor: "Laura Méndez",
          empresa: "Joyería Brillante",
        },
        {
          texto: "Con SHIP IT mis paquetes llegan rápido y sin contratiempos, muy recomendado.",
          autor: "Jorge Castillo",
          empresa: "Distribuidora Norte",
        },
        {
          texto: "Me encanta que puedo rastrear todo desde mi celular en tiempo real.",
          autor: "Diana Pérez",
          empresa: "Boutique UrbanStyle",
        }
      ].map((item, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 bg-white p-8 rounded-xl shadow-lg w-80 text-left snap-center"
        >
          <p className="italic text-gray-700 mb-4">“{item.texto}”</p>
          <p className="font-bold">{item.autor}</p>
          <p className="text-sm text-gray-500">{item.empresa}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* FAQS */}
<section id="faqs" className="py-32 bg-gray-50 text-center">
  <h2 className="text-4xl md:text-5xl font-bold mb-10 font-[Inter]">Preguntas Frecuentes</h2>
  
  <div className="max-w-3xl mx-auto space-y-6 text-left px-6">

    <details className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 p-4 rounded-2xl shadow-2xl transition hover:scale-105">
      <summary className="font-semibold text-lg cursor-pointer">¿Puedo usar SHIP IT! si apenas estoy empezando?</summary>
      <p className="mt-2 text-gray-700">
        Claro que sí. Trabajamos con emprendedores, tiendas en línea y empresas grandes. No importa si haces 1 o 1,000 envíos al mes, tenemos soluciones para todos.
      </p>
    </details>

    <details className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 p-4 rounded-2xl shadow-2xl transition hover:scale-105">
      <summary className="font-semibold text-lg cursor-pointer">¿Cómo funciona el Cobro Contra Entrega (COD)?</summary>
      <p className="mt-2 text-gray-700">
        Tú vendes, SHIP IT! entrega y cobra. Recogemos el dinero en efectivo directamente del cliente final y te lo depositamos o entregamos en efectivo. Es la forma más segura de vender sin arriesgar tu producto.
      </p>
    </details>

    <details className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 p-4 rounded-2xl shadow-2xl transition hover:scale-105">
      <summary className="font-semibold text-lg cursor-pointer">¿Cuánto tardan los envíos?</summary>
      <p className="mt-2 text-gray-700">
        Contamos con 3 modalidades de entrega:<br/><br/>
        • <strong>Mismo Día</strong>: Recolectamos y entregamos el mismo día, en menos de 90 minutos.<br/>
        • <strong>Día Siguiente</strong>: Recolectamos hoy y entregamos al día siguiente.<br/>
        • <strong>Fulfillment</strong>: Almacenamos tus productos en nuestro centro logístico y los despachamos de forma automática cuando recibes pedidos.<br/><br/>
        Todas las modalidades incluyen seguimiento en tiempo real y notificaciones.
      </p>
    </details>

    <details className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 p-4 rounded-2xl shadow-2xl transition hover:scale-105">
      <summary className="font-semibold text-lg cursor-pointer">¿Puedo rastrear mis envíos?</summary>
      <p className="mt-2 text-gray-700">
        Sí, todos tus envíos se pueden rastrear en tiempo real desde nuestra app o web. Además, tu cliente también recibe un link de seguimiento con cada pedido.
      </p>
    </details>

    <details className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 p-4 rounded-2xl shadow-2xl transition hover:scale-105">
      <summary className="font-semibold text-lg cursor-pointer">¿Dónde está disponible SHIP IT!?</summary>
      <p className="mt-2 text-gray-700">
        Actualmente operamos en Monterrey y su Zona Metropolitana. Si tu negocio está en Nuevo León, ya puedes empezar a usar SHIP IT!.
      </p>
    </details>

    <details className="fade-in bg-gradient-to-r from-blue-100 to-purple-200 border border-gray-200 p-4 rounded-2xl shadow-2xl transition hover:scale-105">
      <summary className="font-semibold text-lg cursor-pointer">¿Tienen algún requisito mínimo para enviar?</summary>
      <p className="mt-2 text-gray-700">
        Ninguno, puedes enviar desde 1 paquete. Solo necesitas crear tu cuenta y empezar a programar tus recolecciones cuando lo necesites.
      </p>
    </details>

  </div>
</section>

      {/* FOOTER FINAL */}
<section className="bg-gradient-to-r from-black via-zinc-900 to-black text-gray-300 py-12 px-6">
  
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">

    {/* Columna Izquierda - Logo */}
    <div className="flex justify-center md:justify-start">
      <img src="/2.png" alt="SHIP IT Logo" className="max-h-16 w-auto object-contain" />
    </div>

    {/* Columna Centro - Texto Descriptivo */}
    <div>
      <p className="mb-4">Somos expertos en paquetería y mensajería especializada en envíos locales.</p>
      <p className="font-semibold">Cobertura en Nuevo León y seguimos creciendo.</p>
    </div>

    {/* Columna Derecha - Contacto */}
    <div className="space-y-1">
      <p className="font-semibold">¿Dudas o comentarios?</p>
      <p>WhatsApp (soporte / ventas): <span className="font-bold">81-1977-5897</span></p>
      <p>Soporte / ventas: <a href="mailto:shipitmexico@gmail.com" className="underline">shipitmexico@gmail.com</a></p>
    </div>

  </div>
</section>

{/* FOOTER FINAL EN NEGRO */}
<div className="bg-gradient-to-r from-black via-zinc-900 to-black py-4 px-6">
  <div className="max-w-6xl mx-auto text-center text-xs text-gray-400">
    <p>
      © 2025 <span className="font-semibold text-white">SHIP IT!</span> Powered by <span className="font-bold text-white">Grupo TRACSA</span> | Nuevo León, México | Todos los derechos reservados.
    </p>
  </div>
</div>
</div>
  )
}