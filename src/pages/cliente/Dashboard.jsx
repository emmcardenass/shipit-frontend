// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "@/axios";
import { useNavigate } from "react-router-dom";
import PhraseRotator from "../../components/PhraseRotator";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    navigate("/order-detail", { state: { order } });
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100 dark:bg-darkBackground transition-colors duration-500">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        Mis Pedidos
      </h1>

      {/* 🔥 Frase Premium rotatoria */}
      <PhraseRotator />

      {/* Tabla de pedidos */}
      <div className="card-glass mt-8">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="text-left px-4 py-2">Origen</th>
              <th className="text-left px-4 py-2">Destino</th>
              <th className="text-center px-4 py-2">Estado</th>
              <th className="text-center px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                onClick={() => handleOrderClick(order)}
              >
                <td className="px-4 py-3">{order.origen?.direccion || "Sin Origen"}</td>
                <td className="px-4 py-3">{order.destino?.direccion || "Sin Destino"}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClass(
                      order.estado
                    )}`}
                  >
                    {order.estado.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón de crear pedido rápido */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/crear-pedido")}
          className="bg-primary hover:bg-blue-700 text-white rounded-full px-6 py-3 font-semibold shadow-lg hover:scale-105 transition"
        >
          + Nuevo Pedido
        </button>
      </div>
    </div>
  );
}

const getBadgeClass = (estado) => {
  switch (estado) {
    case "pendiente":
      return "bg-yellow-400 text-white";
    case "en_camino":
      return "bg-blue-400 text-white";
    case "entregado":
      return "bg-green-500 text-white";
    case "reprogramado":
      return "bg-purple-500 text-white";
    case "fallido":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

export default Dashboard;
