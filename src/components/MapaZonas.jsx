// src/components/MapaZonas.jsx
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1Ijoic2hpcGl0bWV4aWNvIiwiYSI6ImNtMGZzMHZ5YjA3dTEyb3B2eng1OW80bWMifQ.jw1dTx1ZKBrD8uNKzCrzjw";

export default function MapaZonas() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-100.3161, 25.6866], // Monterrey
      zoom: 10,
    });

    mapInstance.current.on("load", () => {
      console.log("🗺️ MapaZonas cargado, cargando /zonas.geojson...");

      mapInstance.current.addSource("zonas-shipit", {
        type: "geojson",
        data: "/zonas.geojson", // tu archivo oficial
      });

      mapInstance.current.addLayer({
        id: "zonas-fill",
        type: "fill",
        source: "zonas-shipit",
        paint: {
          "fill-color": "#0066FF",
          "fill-opacity": 0.25,
        },
      });

      mapInstance.current.addLayer({
        id: "zonas-line",
        type: "line",
        source: "zonas-shipit",
        paint: {
          "line-color": "#FF2D95",
          "line-width": 2,
        },
      });

      // ⬇️ Agregamos la capa de etiquetas con el nombre de la zona
      mapInstance.current.addLayer({
        id: "zonas-labels",
        type: "symbol",
        source: "zonas-shipit",
        layout: {
          "text-field": ["get", "name"], // 👈 ajusta aquí si tu propiedad se llama diferente
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 14,
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 2,
        },
      });
    });
  }, []);

  return (
    <div className="w-full">
      <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl mt-4">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
