// src/components/ModalMap.jsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { motion } from "framer-motion";

mapboxgl.accessToken = "pk.eyJ1Ijoic2hpcGl0bWV4aWNvIiwiYSI6ImNtMGZzMHZ5YjA3dTEyb3B2eng1OW80bWMifQ.jw1dTx1ZKBrD8uNKzCrzjw";

export function ModalMap({ datosCotizacion, onClose }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Evitar reinicialización

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-100.3161, 25.6866], // Monterrey centro por defecto
      zoom: 11,
    });

    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([-100.3161, 25.6866]) // Centro simulado (luego lo haremos dinámico)
      .addTo(map.current);

    // Opcionalmente podríamos mover el centro basado en inputs de Origen/Destino luego
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-white dark:bg-darkBackground rounded-2xl shadow-lg p-6 max-w-2xl w-full space-y-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center">Confirmación de Cotización 🚚</h2>

        <div className="text-sm space-y-2 text-center">
          <p><strong>Origen:</strong> {datosCotizacion.origen}</p>
          <p><strong>Destino:</strong> {datosCotizacion.destino}</p>
          <p><strong>Tipo de envío:</strong> {datosCotizacion.tipoEnvio}</p>
          <p><strong>Tamaño del paquete:</strong> {datosCotizacion.tamañoPaquete}</p>
          <p><strong>Costo estimado:</strong> ${datosCotizacion.costoEstimado.toFixed(2)}</p>
        </div>

        {/* Mapa dinámico */}
        <div ref={mapContainer} className="h-64 rounded-xl overflow-hidden shadow-inner" />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="button-success hover-zoom mt-4"
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
