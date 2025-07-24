// src/pages/LandingMobile.jsx
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

export default function LandingMobile() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-br from-blue-500 via-white to-orange-300">
      <img src="/logo-shipit.png" alt="SHIP IT Logo" className="w-32 mb-6" />

      <h1 className="text-3xl font-bold mb-4 text-white drop-shadow">¡Bienvenido a SHIP IT!</h1>
      <p className="text-base mb-8 text-white/80">Solo disponible en escritorio por ahora.</p>

      <Button className="w-full max-w-xs mb-4 bg-white text-blue-700 hover:bg-white/90">
        <a href="https://wa.me/528119775897" target="_blank" rel="noopener noreferrer">
          <PhoneCall className="inline mr-2" /> Contáctanos por WhatsApp
        </a>
      </Button>

      <p className="text-sm text-white/70 mt-6">📦 Muy pronto disponible en tu celular</p>
    </div>
  );
}
