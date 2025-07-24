// src/shipit-ui/animations.js

export const fadeSlide = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.8, ease: "easeInOut" }
  };
  
  export const hoverZoom = {
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300 }
  };
  