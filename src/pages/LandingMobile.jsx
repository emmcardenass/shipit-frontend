import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneCall } from "lucide-react"; // ✅ Se mantiene

gsap.registerPlugin(ScrollTrigger);

export default function LandingMobile() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    ).fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "<0.3"
    ).fromTo(
      ctaRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 },
      "<0.2"
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0601FB] via-white to-[#FF7925] flex flex-col items-center justify-center text-center px-6">
      <img
        src="/logo-shipit.png"
        alt="SHIP IT Logo"
        className="w-28 mb-6 drop-shadow"
      />

      <h1
        ref={titleRef}
        className="text-3xl font-bold text-white drop-shadow mb-4"
      >
        ¡Bienvenido a SHIP IT!
      </h1>

      <p
        ref={subtitleRef}
        className="text-white/80 text-base mb-8"
      >
        Esta versión está optimizada para escritorio.<br />
        ¡Muy pronto disponible para tu celular!
      </p>

      <div ref={ctaRef} className="w-full max-w-xs">
        <a
          href="https://wa.me/528119775897"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-[#0601FB] font-medium rounded-lg shadow-md hover:bg-white/90 transition"
        >
          <PhoneCall className="mr-2 h-5 w-5" />
          Contáctanos por WhatsApp
        </a>
      </div>

      <p className="text-white/60 text-sm mt-10">
        📦 En desarrollo versión móvil
      </p>
    </div>
  );
}
