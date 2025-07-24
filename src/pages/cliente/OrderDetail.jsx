// src/pages/cliente/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/axios";
import { motion } from "framer-motion";
import PageTransition from "../../shipit-ui/pageTransition";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GuiaPDF from "../../components/GuiaPDF";
import { ClipboardCopy } from "lucide-react";

function OrderDetail() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedido(res.data);
      } catch (error) {
        console.error("Error al cargar el pedido:", error);
      }
    };
    fetchPedido();
  }, [id]);

  const copiarGuia = () => {
    if (pedido?.envio?.numeroGuia) {
      navigator.clipboard.writeText(pedido.envio.numeroGuia);
    }
  };

  return (
    <PageTransition>
      <div className="pt-24 px-6">
        <motion.div
          className="card-glass max-w-3xl mx-auto p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Detalles del Pedido</h1>

          {pedido ? (
            <div className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
              <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleString()}</p>
              <p><strong>Remitente:</strong> {pedido.envio?.remitente}</p>
              <p><strong>Teléfono remitente:</strong> {pedido.envio?.telRemitente}</p>
              <p><strong>Correo remitente:</strong> {pedido.envio?.emailRemitente}</p>
              <p><strong>Dirección origen:</strong> {pedido.origen?.direccion}</p>
              <hr className="my-4" />
              <p><strong>Destinatario:</strong> {pedido.envio?.destinatario}</p>
              <p><strong>Teléfono destinatario:</strong> {pedido.envio?.telDestinatario}</p>
              <p><strong>Correo destinatario:</strong> {pedido.envio?.emailDestinatario}</p>
              <p><strong>Dirección destino:</strong> {pedido.destino?.direccion}</p>
              <p><strong>Tipo de envío:</strong> {pedido.envio?.tipo}</p>
              <p><strong>Contenido:</strong> {pedido.envio?.contenido}</p>
              <p><strong>Peso:</strong> {pedido.envio?.peso}</p>
              <p><strong>Dimensiones:</strong> {pedido.envio?.alto} x {pedido.envio?.largo} x {pedido.envio?.ancho}</p>
              <p><strong>Instrucciones:</strong> {pedido.envio?.instrucciones || "N/A"}</p>

              {/* Número de guía con botón copiar */}
              <div className="flex items-center gap-2">
                <p><strong>Número de guía:</strong> {pedido.envio?.numeroGuia || "No asignado"}</p>
                {pedido.envio?.numeroGuia && (
                  <button
                    onClick={copiarGuia}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    title="Copiar número de guía"
                  >
                    <ClipboardCopy size={18} />
                  </button>
                )}
              </div>

              <div className="pt-4">
                <PDFDownloadLink
                  document={<GuiaPDF envio={pedido} />}
                  fileName={`guia-${pedido._id}.pdf`}
                  className="button-success px-4 py-2 rounded-lg text-sm text-white hover:scale-105 transition"
                >
                  Descargar guía en PDF
                </PDFDownloadLink>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Cargando detalles del pedido...</p>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default OrderDetail;

