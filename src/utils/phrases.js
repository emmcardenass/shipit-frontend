// src/utils/phrases.js

const frasesPremium = [
    "El éxito no se entrega. Se conquista.",
    "Tu paquete no es solo un envío, es una promesa.",
    "Cada entrega es una oportunidad para brillar.",
    "Donde otros ven distancia, nosotros vemos compromiso.",
    "Velocidad y excelencia en cada envío.",
    "Convertimos la logística en arte.",
    "Envíos rápidos, clientes felices.",
    "Cada paquete es una historia que merece llegar bien.",
    "Nuestro motor: tu confianza.",
    "Mover el mundo, un envío a la vez.",
    "La pasión por entregar lo mejor.",
    "La perfección en movimiento.",
    "Tus sueños, nuestro destino.",
    "La logística también puede ser elegante.",
    "SHIP IT! Porque cada segundo importa.",
    "Somos los mensajeros de tu éxito.",
    "Confía en quien entiende tu urgencia.",
    "Cada destino es el principio de algo grande.",
    "No entregamos cajas, entregamos experiencias.",
    "Donde hay voluntad, llega SHIP IT!",
  ];
  
  export function getFrasePremiumRandom() {
    const index = Math.floor(Math.random() * frasesPremium.length);
    return frasesPremium[index];
  }
  