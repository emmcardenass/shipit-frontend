// src/components/PhraseRotator.jsx
import { useEffect, useState } from "react";

const phrases = [
  "🚀 ¡Tu paquete está en buenas manos!",
  "📦 Entregamos más que paquetes, entregamos confianza.",
  "🛵 Cada entrega, una misión cumplida.",
  "🌎 ¡Conectando destinos, acercando sueños!",
  "⏱️ Tu tiempo es prioridad: entregas veloces y seguras.",
  "💡 La logística inteligente empieza aquí.",
  "🔒 Seguridad premium en cada envío.",
  "🌟 Transformamos entregas en experiencias memorables.",
  "🗺️ Llegamos donde otros no llegan.",
  "🤝 Tu socio confiable en envíos locales.",
];

function PhraseRotator() {
  const [currentPhrase, setCurrentPhrase] = useState("");

  useEffect(() => {
    const changePhrase = () => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setCurrentPhrase(phrases[randomIndex]);
    };

    changePhrase(); // Mostrar una al cargar
    const interval = setInterval(changePhrase, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mt-6">
      <p className="text-lg italic text-gray-700 dark:text-gray-300 animate-fadeIn">
        {currentPhrase}
      </p>
    </div>
  );
}

export default PhraseRotator;
