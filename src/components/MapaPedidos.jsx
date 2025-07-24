// src/components/MapaPedidos.jsx
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1Ijoic2hpcGl0bWV4aWNvIiwiYSI6ImNtMGZzN2NvbTAzM2wyaXBzMm16ZDRlaWgifQ.YrPt3qlkzgZeRa-gjfE1ng";

export default function MapaPedidos({ pedidos = [] }) {
  console.log("📦 Pedidos recibidos por el mapa:", pedidos);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-100.3161, 25.6866],
      zoom: 10,
    });
    console.log("🗺️ Mapa creado, esperando que cargue...");

    mapInstance.current.on("load", () => {
      // Cargar zonas con escala de demanda
      console.log("🗺️ Mapa cargado, entrando a .on('load')");
      mapInstance.current.addSource("zonas-shipit", {
        type: "geojson",
        data: "/zonas.geojson",
      });

      mapInstance.current.addLayer({
        id: "zonas-fill",
        type: "fill",
        source: "zonas-shipit",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "demanda"],
            0, "#FFEDD5",
            10, "#FDBA74",
            20, "#FB923C",
            30, "#F97316",
            40, "#EA580C",
            50, "#C2410C"
          ],
          "fill-opacity": 0.3,
        },
      });

      mapInstance.current.addLayer({
        id: "zonas-line",
        type: "line",
        source: "zonas-shipit",
        paint: {
          "line-color": "#FF7925",
          "line-width": 2,
        },
      });

      // PINS PREMIUM
      const bounds = new mapboxgl.LngLatBounds();

      const getColorByEstado = (estado) => {
        switch (estado.toLowerCase()) {
          case "en camino": return "#0601FB";
          case "entregado": return "#16A34A";
          case "reagendado": return "#EAB308";
          case "cancelado": return "#DC2626";
          case "recolectado": return "#9333EA";
          case "creado": default: return "#9CA3AF";
        }
      };

      pedidos.forEach((pedido) => {
        const coords = pedido?.coordenadas;
        const estado = pedido?.estado || "creado";
        const guia = pedido?.guia || "Desconocida";
      
        console.log("📍 Intentando crear marcador:", { coords, estado, guia });
      
        if (!coords || !Array.isArray(coords) || coords.length !== 2) {
          console.warn("❗ Coordenadas inválidas:", pedido);
          return;
        }
      
        const el = document.createElement("div");
        el.className = "marker";
        el.style.width = "18px";
        el.style.height = "18px";
        el.style.backgroundColor = getColorByEstado(estado);
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";
      
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="text-sm">
            <strong>Estado:</strong> ${estado}<br />
            <strong>Guía:</strong> ${guia}<br />
            <a href="/rastreo/${guia}" class="text-blue-600 underline">Ver rastreo</a>
          </div>
        `);

        console.log("📌 Coordenadas originales:", coords);
      
        new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(mapInstance.current);
      
        bounds.extend(coords);
      });      
        
      if (pedidos.length > 0) {
        mapInstance.current.fitBounds(bounds, { padding: 60 });
      }
    });
  }, [pedidos]);

  return (
    <div className="w-full">
      <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl mt-8">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Leyenda de estados */}
      <div className="mt-4 bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl p-4 shadow-md">
        <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">🔑 Leyenda de estados</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Leyenda color="#0601FB" label="En camino" />
          <Leyenda color="#16A34A" label="Entregado" />
          <Leyenda color="#EAB308" label="Reagendado" />
          <Leyenda color="#DC2626" label="Cancelado" />
          <Leyenda color="#9333EA" label="Recolectado" />
          <Leyenda color="#9CA3AF" label="Creado" />
        </div>
      </div>

      {/* Leyenda de zonas por demanda */}
      <div className="mt-4 bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl p-4 shadow-md">
        <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">🔥 Zonas por nivel de demanda</h4>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Leyenda color="#FFEDD5" label="0 - Muy baja" />
          <Leyenda color="#FDBA74" label="10 - Baja" />
          <Leyenda color="#FB923C" label="20 - Media-baja" />
          <Leyenda color="#F97316" label="30 - Media" />
          <Leyenda color="#EA580C" label="40 - Alta" />
          <Leyenda color="#C2410C" label="50 - Muy alta" />
        </div>
      </div>
    </div>
  );
}

function Leyenda({ color, label }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-4 h-4 rounded-full border border-white shadow"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}

