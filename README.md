# 🚀 SHIP IT! | Plataforma de envíos locales premium

Bienvenido a la plataforma de envíos SHIP IT!  
Sistema optimizado para logística local de alta eficiencia, visualmente premium y con estructura SaaS lista para escalar.

---

## 🛠️ Estructura del proyecto

/src
/components → Botones, loaders, scroll buttons
/layouts → Layout general (Navbar + estructura premium)
/pages → Páginas individuales (Dashboard, CrearPedido, OrderDetail)
App.jsx → Manejo de rutas y animaciones
main.jsx → Montaje de la app
tailwind.config.js → Configuración de estilos

---

## 🌐 Tecnologías principales

- React 18+
- React Router 6+
- TailwindCSS 3+
- Framer Motion (animaciones de cambio de página)
- Google Maps Places API (geolocalización de direcciones)
- Axios (conexión API backend)
- Lucide-react (íconos premium)
- React Hot Toast (notificaciones premium)

---

## 📄 Agregar una nueva página

1. Crea un archivo nuevo dentro de `/src/pages` (ej: `NuevaPagina.jsx`)
2. Agrega una ruta en `App.jsx`, ejemplo:

```jsx
<Route path="/nueva-pagina" element={<NuevaPagina />} />
