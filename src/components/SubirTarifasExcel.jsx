// src/components/SubirTarifasExcel.jsx
import { useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";

export default function SubirTarifasExcel({ onTarifasActualizadas }) {
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [procesandoExcel, setProcesandoExcel] = useState(false);

  const handleArchivoChange = (e) => {
    setArchivoExcel(e.target.files[0]);
  };

  const handleProcesarExcel = async () => {
    if (!archivoExcel) {
      toast.error("Selecciona un archivo Excel primero");
      return;
    }

    try {
      setProcesandoExcel(true);

      const formData = new FormData();
      formData.append("archivo", archivoExcel);

      const token = localStorage.getItem("token");

      await axios.post("/tarifas/importar-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Tarifas importadas correctamente");
      setArchivoExcel(null);
      onTarifasActualizadas();
    } catch (error) {
      console.error("Error al importar tarifas:", error);
      toast.error("Error al importar tarifas");
    } finally {
      setProcesandoExcel(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        📤 Subir tarifas desde Excel
      </h3>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleArchivoChange}
        className="mb-4"
      />

      <div>
        <button
          onClick={handleProcesarExcel}
          disabled={procesandoExcel}
          className={`${
            procesandoExcel ? "opacity-50 cursor-not-allowed" : ""
          } bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700`}
        >
          {procesandoExcel ? "Procesando..." : "Procesar Excel"}
        </button>
      </div>
    </div>
  );
}
