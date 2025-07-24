// src/pages/cliente/Billetera.jsx
import { useEffect, useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";
import PageTransition from "../../shipit-ui/pageTransition";

export default function Billetera() {
  const [balance, setBalance] = useState(0);
  const [saldoEnvios, setSaldoEnvios] = useState(0);
  const [transacciones, setTransacciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(null);
  const [monto, setMonto] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [fechaBusqueda, setFechaBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [metodoPago, setMetodoPago] = useState("spei");
  const [tuBanco, setTuBanco] = useState("");
  const [tuClabe, setTuClabe] = useState("");
  const [tuBancoOtro, setTuBancoOtro] = useState("");
  const [itemsVisibles, setItemsVisibles] = useState(20);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data) throw new Error("Sin datos válidos");

        setBalance(Number(res.data.balance || 0));
        setSaldoEnvios(Number(res.data.saldo || 0));
        setTransacciones(res.data.transacciones || []);
      } catch (err) {
        toast.error("Error al cargar billetera");
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setMonto("");
        setConfirmado(false);
        setMetodoPago("spei");
        setTuBanco("");
        setTuClabe("");
        setTuBancoOtro("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);  

  const ejecutarAccion = async () => {
    const cantidad = modal === "retiro" ? balance : parseFloat(monto) || 0;
  
    if (modal !== "retiro" && cantidad <= 0) return toast.error("Ingresa un monto válido");
    if (modal === "migrar" && cantidad > balance) return toast.error("Monto mayor al disponible");
    if (!confirmado) return toast.error("Debes confirmar la transacción");
  
    try {
      const token = localStorage.getItem("token");
  
      if (modal === "migrar") {
        await axios.post("/wallet/migrar", { monto: cantidad }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Saldo migrado correctamente");
  
      } else if (modal === "agregar") {
        await axios.post("/wallet/agregar-saldo", {
          metodo: metodoPago,
          monto: cantidad,
          banco: tuBanco,
          bancoOtro: tuBancoOtro,
          clabe: tuClabe,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Solicitud de recarga enviada correctamente");
  
      } else if (modal === "retiro") {
        await axios.post("/wallet/retiro", {
          metodo: metodoPago,
          monto: cantidad,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Solicitud enviada correctamente");
      }
  
      // Limpiar estados DESPUÉS de enviar la solicitud
      setModal(null);
      setMonto("");
      setConfirmado(false);
      setMetodoPago("spei");
      setTuBanco("");
      setTuClabe("");
      setTuBancoOtro("");
  
      // Recargar datos
      const res = await axios.get("/users/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(Number(res.data.balance || 0));
      setSaldoEnvios(Number(res.data.saldo || 0));
      setTransacciones(res.data.transacciones || []);
  
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al procesar");
    }
  };  

  const transaccionesFiltradas = transacciones
    .slice()
    .reverse()
    .filter((tx) => {
      const tipo = tx.tipo.toLowerCase();
      const filtro = filtroTipo.toLowerCase();

      const coincideTipo =
        filtro === "todos" ||
        (filtro === "migración" && tipo.includes("migración")) ||
        (filtro === "efectivo" && tipo.includes("efectivo")) ||
        (filtro === "depósito" && tipo.includes("depósito"));

      const coincideFecha = !fechaBusqueda || (() => {
        const fechaTxLocal = new Date(new Date(tx.fecha).getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
        return fechaTxLocal === fechaBusqueda;
      })();

      return coincideTipo && coincideFecha;
    });

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 px-4 relative">
        <div className="card-glass p-6 space-y-6">
        <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Mi Billetera
</h1>

<div className="grid md:grid-cols-2 gap-4">
  <div className="card-glass p-4">
    <h2 className="text-sm text-gray-500">Saldo disponible para envíos</h2>
    <p className="text-xl font-bold text-blue-600">
      ${Number(saldoEnvios || 0).toFixed(2)}
    </p>
  </div>

  <div className="card-glass p-4">
    <h2 className="text-sm text-gray-500">Balance (cobrado COD)</h2>
    <p className="text-xl font-bold text-green-600">
      ${Number(balance || 0).toFixed(2)}
    </p>
  </div>
</div>

          <div className="flex justify-center gap-4 mt-4">
  <button
    onClick={() => setModal("agregar")}
    className="button-primary w-56 py-2 rounded-lg text-sm text-white"
  >
    Agregar saldo para envíos
  </button>

  <button
    onClick={() => setModal("migrar")}
    className="button-primary w-56 py-2 rounded-lg text-sm text-white"
  >
    Migrar saldo a envíos
  </button>

  <button
    onClick={() => setModal("retiro")}
    className="button-success w-56 py-2 rounded-lg text-sm text-white"
  >
    Solicitar retiro
  </button>
</div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">🧾 Historial de transacciones</h2>

            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                type="date"
                value={fechaBusqueda}
                onChange={(e) => setFechaBusqueda(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-500 focus:outline-none focus:ring-0 transition-none"
              />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-500 focus:outline-none focus:ring-0 transition-none"
              >
                <option value="todos">Todos los tipos</option>
                <option value="migración">Migraciones</option>
                <option value="efectivo">Retiro en efectivo</option>
                <option value="depósito">Retiro por depósito</option>
              </select>
            </div>

            {cargando ? (
              <p className="text-gray-400">Cargando...</p>
            ) : transaccionesFiltradas.length === 0 ? (
              <p className="text-gray-400">No se encontraron transacciones.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
  {transaccionesFiltradas.slice(0, itemsVisibles).map((tx, idx) => {

// Define el color por estado
const color = tx.tipo?.toLowerCase().includes("recarga") 
  ? tx.aprobado 
    ? "text-green-600" 
    : "text-yellow-500"
  : tx.tipo?.toLowerCase().includes("rechazada")
    ? "text-red-600"
    : "text-[#0601FB]"; // Azul para otros movimientos como migraciones

return (
  <li key={idx} className="py-2 px-4 text-sm">
    <div className="flex justify-between">
      <span>{new Date(tx.fecha).toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short"
      })}</span>
      <span className="font-semibold">{tx.tipo}</span>
      <span className={color}>
        ${Math.abs(tx.monto).toFixed(2)}
      </span>
    </div>
  </li>
);
})}

  </ul>
  {itemsVisibles < transaccionesFiltradas.length && (
  <div className="text-center p-4">
    <button
      onClick={() => setItemsVisibles((prev) => prev + 25)}
      className="text-sm text-blue-600 hover:underline"
    >
      Ver más transacciones
    </button>
  </div>
)}
</div>
            )}
          </div>
        </div>

        {modal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => {
      setModal(null);
      setMonto("");
      setConfirmado(false);
      setMetodoPago("spei");
      setTuBanco("");
      setTuClabe("");
      setTuBancoOtro("");
    }}
  >
    <div
      className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // PREVIENE cerrar si clic dentro del modal
    >
      <h2 className="text-lg font-semibold">
      {modal === "migrar"
  ? "Migrar saldo"
  : modal === "agregar"
  ? "Agregar saldo para envíos"
  : modal === "retiro"
  ? "Solicitar retiro"
  : "Solicitud"}
      </h2>
      <p className="text-sm text-gray-500">
        Tu balance actual es de <strong>${balance.toFixed(2)}</strong>
        </p>
        {/* Campo de monto solo para migrar o agregar saldo */}
{(modal === "migrar" || modal === "agregar") && (
  <div className="space-y-2 pt-2">
    <label className="block text-sm font-medium text-gray-700">
      Monto a {modal === "migrar" ? "migrar" : "agregar"} (MXN)
    </label>
    <input
      type="number"
      placeholder="Ej. 500"
      min="1"
      step="1"
      value={monto}
      onChange={(e) => setMonto(e.target.value.replace(/\D/g, ""))}
      className="w-full px-4 py-2 rounded-lg border text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0"
      required
    />
  </div>
)}
        {modal === "retiro" && (
  <div className="space-y-3 pt-2">
    <label className="block text-sm font-medium text-gray-700">Método de retiro</label>
    <select
      value={metodoPago}
      onChange={(e) => setMetodoPago(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0"
    >
      <option value="" disabled hidden>
        Selecciona opción
      </option>
      <option value="efectivo">Efectivo (gratis con próxima entrega)</option>
      <option value="depósito">Depósito bancario</option>
    </select>

    {metodoPago === "depósito" && (
      <div className="space-y-2 pt-1">
        <label className="block text-sm font-medium text-gray-700">Tu Banco</label>
        <select
          value={tuBanco}
          onChange={(e) => setTuBanco(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 ${
            !tuBanco ? "text-gray-400" : "text-black"
          }`}
        >
          <option value="" disabled hidden>Selecciona tu banco</option>
          <option value="BBVA">BBVA</option>
          <option value="Citibanamex">Citibanamex</option>
          <option value="Santander">Santander</option>
          <option value="Banorte">Banorte</option>
          <option value="HSBC">HSBC</option>
          <option value="Scotiabank">Scotiabank</option>
          <option value="Inbursa">Inbursa</option>
          <option value="Banregio">Banregio</option>
          <option value="Banco Azteca">Banco Azteca</option>
          <option value="Afirme">Afirme</option>
          <option value="BanBajío">BanBajío</option>
          <option value="Banco Multiva">Banco Multiva</option>
          <option value="Banco Famsa">Banco Famsa</option>
          <option value="Otro">Otro</option>
        </select>

        {tuBanco === "Otro" && (
          <input
            type="text"
            placeholder="Especifica tu banco"
            value={tuBancoOtro}
            onChange={(e) => setTuBancoOtro(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0"
          />
        )}

        <label className="block text-sm font-medium text-gray-700 mt-2">CLABE interbancaria</label>
        <input
          type="text"
          placeholder="Ej. 012345678901234567"
          value={tuClabe}
          onChange={(e) => setTuClabe(e.target.value.replace(/\D/g, ""))}
          maxLength={18}
          className="w-full px-4 py-2 rounded-lg border text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0"
        />
      </div>
    )}
  </div>
)}

      {modal === "agregar" && (
  <>
    <label className="block text-sm font-medium text-gray-700">
      Forma de pago
    </label>
    <select
      value={metodoPago}
      onChange={(e) => setMetodoPago(e.target.value)}
      className={`w-full px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 ${
        !metodoPago ? "text-gray-400" : "text-black"
      }`}
    >
      <option value="" disabled hidden className="!text-gray-400">
        Selecciona forma de pago
      </option>
      <option value="spei">Transferencia SPEI</option>
      <option value="tarjeta">Tarjeta de crédito o débito</option>
    </select>
  </>
)}

{/* Campos adicionales para SPEI */}
{modal === "agregar" && metodoPago === "spei" && (
  <>
    <div className="text-sm text-gray-600 space-y-1 border-t pt-2 mt-2">
      <p className="font-semibold">
        Realiza transferencia SPEI con aprobación automática:
      </p>
      <ul className="list-decimal list-inside space-y-1">
        <li>Registra tu CLABE interbancaria de la cuenta que utilizarás para pagar saldo de servicios.</li>
        <li>Realiza tu transferencia a nuestra cuenta bancaria.</li>
        <li>Nuestro sistema aprobará tu pago de forma automática en un lapso no mayor a 15 minutos.</li>
      </ul>
      <div className="mt-3 text-blue-600 font-medium space-y-1">
        <p>📌 <strong>CLABE:</strong> 058597000076174069</p>
        <p>🏦 <strong>Banco:</strong> BANREGIO</p>
        <p>👤 <strong>Beneficiario:</strong> EMMANUEL ALEJANDRO CÁRDENAS GUTIÉRREZ</p>
      </div>
    </div>

    {/* Campos adicionales */}
    <div className="space-y-2 pt-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tu Banco</label>
        <select
          value={tuBanco}
          onChange={(e) => setTuBanco(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 ${
            !tuBanco ? "text-gray-400" : "text-black"
          }`}
        >
          <option value="" disabled hidden className="!text-gray-400">Selecciona tu banco</option>
          <option value="BBVA">BBVA</option>
          <option value="Citibanamex">Citibanamex</option>
          <option value="Santander">Santander</option>
          <option value="Banorte">Banorte</option>
          <option value="HSBC">HSBC</option>
          <option value="Scotiabank">Scotiabank</option>
          <option value="Inbursa">Inbursa</option>
          <option value="Banregio">Banregio</option>
          <option value="Banca Mifel">Banca Mifel</option>
          <option value="Banco Azteca">Banco Azteca</option>
          <option value="Afirme">Afirme</option>
          <option value="BanBajío">BanBajío</option>
          <option value="Banco Multiva">Banco Multiva</option>
          <option value="Banco Famsa">Banco Famsa</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      {tuBanco === "Otro" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Especifica tu banco</label>
          <input
            type="text"
            placeholder="Nombre de tu banco"
            value={tuBancoOtro}
            onChange={(e) => setTuBancoOtro(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-0"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tu CLABE Interbancaria</label>
        <input
          type="text"
          placeholder="Ej. 012345678901234567"
          value={tuClabe}
          onChange={(e) => setTuClabe(e.target.value.replace(/\D/g, ""))}
          maxLength={18}
          className="w-full px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  </>
)}

      {/* Instrucciones Tarjeta */}
      {modal === "agregar" && metodoPago === "tarjeta" && (
        <p className="text-sm text-gray-600 border-t pt-2 mt-2">
          Elige esta opción para pagar con tarjeta de crédito o débito. El pago se procesará de forma segura.
        </p>
      )}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={confirmado}
          onChange={() => setConfirmado(!confirmado)}
          className="mt-1 w-4 h-4 border border-gray-300 rounded-sm accent-blue-600"
        />
        <label className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
          Entiendo que esta transacción no puede revertirse.
        </label>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          onClick={() => {
            setModal(null);
            setMonto("");
            setConfirmado(false);
            setMetodoPago("spei");
            setTuBanco("");
            setTuClabe("");
          }}
          className="text-sm px-4 py-2 rounded-lg border"
        >
          Cancelar
        </button>
        <button
          onClick={ejecutarAccion}
          className="button-primary px-4 py-2 rounded-lg text-sm"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </PageTransition>
  );
}
