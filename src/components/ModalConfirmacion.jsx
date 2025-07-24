// src/components/ModalConfirmacion.jsx
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import toast from "react-hot-toast";
import axios from "@/axios";

mapboxgl.accessToken = "pk.eyJ1Ijoic2hpcGl0bWV4aWNvIiwiYSI6ImNtMGZzMHZ5YjA3dTEyb3B2eng1OW80bWMifQ.jw1dTx1ZKBrD8uNKzCrzjw";

function ModalConfirmacion({ datos, onClose }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-100.3161, 25.6866], // Centro Monterrey
      zoom: 11,
    });

    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([-100.3161, 25.6866])
      .addTo(map);

    return () => map.remove();
  }, []);

  const crearPedido = async () => {
    try {
      const token = localStorage.getItem("token");

      const nuevoPedido = {
        origen: {
          direccion: datos.origen,
          referencia: "",
          nombre: "Cliente origen",
          telefono: "8112345678",
        },
        destino: {
          direccion: datos.destino,
          referencia: "",
          nombre: "Cliente destino",
          telefono: "8112345679",
        },
        tipoEnvio: "standard",
        formaPago: "prepago",
        montoContraEntrega: 0,
      };

      await axios.post("/orders", nuevoPedido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("🚀 Pedido creado exitosamente");
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Error al crear pedido");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white dark:bg-darkBackground card-glass max-w-2xl w-full p-6 rounded-2xl shadow-lg space-y-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center">Confirmación 🚚</h2>

        <div className="space-y-2 text-center text-sm">
          <p><strong>Origen:</strong> {datos.origen}</p>
          <p><strong>Destino:</strong> {datos.destino}</p>
          <p><strong>Peso:</strong> {datos.peso} kg</p>
          <p><strong>Tamaño estimado:</strong> {datos.tamaño}</p>
          <p><strong>Costo:</strong> ${datos.costo}</p>
        </div>

        <div ref={mapContainer} className="h-64 rounded-lg overflow-hidden shadow-inner" />

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="button-cancel hover-zoom">
            Cancelar
          </button>
          <button onClick={crearPedido} className="button-success hover-zoom">
            Confirmar Pedido
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ModalConfirmacion;
