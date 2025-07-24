import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 🎯 Agrega efecto dinámico de fondo con el cursor
document.addEventListener("mousemove", (e) => {
  const root = document.documentElement;
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  root.style.setProperty("--cursor-x", `${x}%`);
  root.style.setProperty("--cursor-y", `${y}%`);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
