import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../../shipit-ui/pageTransition";
import AutocompleteDireccion from "../../components/AutocompleteDireccion";
import MapaEnvio from "../../components/MapaEnvio";
import ResponsiveSection from "../../components/ResponsiveSection";
import axios from "@/axios";
import toast from "react-hot-toast";

function CrearPedido() {
  const navigate = useNavigate();
  const [origen, setOrigen] = useState({ direccion: "", coordenadas: [] });
  const [destino, setDestino] = useState({
    direccion: "",
    coordenadas: [],
    referencia: "",
    nombre: "",
    telefono: ""
  });  
  const [confirmadoOrigen, setConfirmadoOrigen] = useState(false);
  const [confirmadoDestino, setConfirmadoDestino] = useState(false);
  const [mostrarMontoCOD, setMostrarMontoCOD] = useState(false);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [datosPerfil, setDatosPerfil] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [pesoVolumetrico, setPesoVolumetrico] = useState(0);
  const [excesoPeso, setExcesoPeso] = useState(false);
  const [saldo, setSaldo] = useState(0);
const [totalEnvio, setTotalEnvio] = useState(null);
const [puedePagar, setPuedePagar] = useState(false);
const [desglosePrecio, setDesglosePrecio] = useState(null);
const [calculandoPrecio, setCalculandoPrecio] = useState(false);


  const [envio, setEnvio] = useState({
    remitente: "",
    telRemitente: "",
    emailRemitente: "",
    direccionRemitente: "",
    destinatario: "",
    telDestinatario: "",
    emailDestinatario: "",
    alto: "",
    largo: "",
    ancho: "",
    peso: "",
    contenido: "",
    tipo: "",
    cod: "",
    instrucciones: "",
    tipoPago: "prepago", // o puedes dejarlo vacío si prefieres forzar que el usuario elija
  });

  useEffect(() => {
    const alto = parseFloat(envio.alto) || 0;
    const largo = parseFloat(envio.largo) || 0;
    const ancho = parseFloat(envio.ancho) || 0;
  
    if (alto && largo && ancho) {
      const volumetrico = (alto * largo * ancho) / 5000;
      setPesoVolumetrico(volumetrico.toFixed(2));
    } else {
      setPesoVolumetrico(0);
    }
  }, [envio.alto, envio.largo, envio.ancho]);  

  useEffect(() => {
    if (destino?.coordenadas?.length && envio.peso && envio.tipo) {
      calcularPrecio();
    } else {
      setDesglosePrecio(null);
    }
  }, [destino, envio.peso, envio.tipo, envio.cod]);   

  useEffect(() => {
    const real = parseFloat(envio.peso) || 0;
    const volumetrico = parseFloat(pesoVolumetrico) || 0;
  
    setExcesoPeso(real > 30 || volumetrico > 30);
  }, [envio.peso, pesoVolumetrico]);
  

  useEffect(() => {
    const nombre = localStorage.getItem("name") || "";
    const email = localStorage.getItem("email") || "";
    const telefono = localStorage.getItem("telefono") || "";
    const direccion = localStorage.getItem("direccion") || "";
  
    setDatosPerfil({
      remitente: nombre,
      telRemitente: telefono,
      emailRemitente: email,
      direccionRemitente: direccion
    });
  
    const token = localStorage.getItem("token");
    axios.get("/clientes", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setClientesFrecuentes(res.data))
      .catch(() => toast.error("No se pudieron cargar clientes frecuentes"));
  
    usarDatosGuardados(); // 👈 Esta línea importa automáticamente los datos
  }, []);  

  const handleChange = (e, state, setState) => {
    const { name, value } = e.target;
  
    let newState = { ...state, [name]: value };
  
    if (["alto", "largo", "ancho", "peso"].includes(name)) {
      const clean = value.replace(/\D/g, "");
      newState[name] = clean;
  
      // Recalcular peso volumétrico si ya hay datos
      const alto = name === "alto" ? parseFloat(clean) : parseFloat(state.alto) || 0;
      const largo = name === "largo" ? parseFloat(clean) : parseFloat(state.largo) || 0;
      const ancho = name === "ancho" ? parseFloat(clean) : parseFloat(state.ancho) || 0;
  
      const volumetrico = (alto * largo * ancho) / 5000;
      setPesoVolumetrico(volumetrico.toFixed(2));
    }
  
    setState(newState);
  };  

  const calcularPrecio = async () => {
    try {
      setCalculandoPrecio(true);
      const res = await axios.post("/tarifas/calcular-precio", {
        destino,
        envio: {
          peso: Math.max(parseFloat(envio.peso) || 0, parseFloat(pesoVolumetrico) || 0),
          tipo: envio.tipo,
          cod: envio.cod || 0
        }
      });
      setDesglosePrecio(res.data);
    } catch (error) {
      console.error("Error al calcular precio:", error);
      setDesglosePrecio(null);
    } finally {
      setCalculandoPrecio(false);
    }
  };  

  const usarDatosGuardados = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { name, telefono, email, direccion } = res.data;

      setEnvio((prev) => ({
        ...prev,
        remitente: name || "",
        telRemitente: telefono || "",
        emailRemitente: email || "",
        direccionRemitente: direccion || ""
      }));

      if (direccion) {
        setOrigen({ direccion, coordenadas: null });
        setConfirmadoOrigen(true);
      }
    } catch (error) {
      toast.error("No se pudieron cargar los datos del perfil");
    }
  };

  const limpiarDatosRecoleccion = () => {
    setEnvio((prev) => ({
      ...prev,
      remitente: "",
      telRemitente: "",
      emailRemitente: "",
      direccionRemitente: ""
    }));
    setOrigen({ direccion: "", coordenadas: [] });
    setConfirmadoOrigen(false);
  };  

  const seleccionarClienteFrecuente = (cliente) => {
    setEnvio((prev) => ({
      ...prev,
      destinatario: cliente.nombre,
      telDestinatario: cliente.telefono,
      emailDestinatario: cliente.email || "",
    }));
    setDestino({ direccion: cliente.direccion, coordenadas: null });
    setConfirmadoDestino(true);
    setBusquedaCliente("");
  };

  const guardarClienteFrecuente = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("/clientes", {
        nombre: envio.destinatario,
        telefono: envio.telDestinatario,
        email: envio.emailDestinatario,
        direccion: destino?.direccion || "",
        coordenadas: destino?.coordenadas || []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Cliente guardado exitosamente");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al guardar cliente frecuente");
      }
    }
  };  

  const handleAgregarPedido = async (e) => {
    e.preventDefault();
  
    const obtenerCoordenadas = async (direccion) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: direccion,
              key: "AIzaSyChICk7EBnjDMBmkAnREOEu9N0GjWmIlyE",
            },
          }
        );
        const location = response.data.results[0]?.geometry.location;
        return location ? [location.lat, location.lng] : [];
      } catch (error) {
        console.error("Error obteniendo coordenadas:", error);
        return [];
      }
    };
  
    const coordenadasOrigen =
      origen.coordenadas?.length > 0
        ? origen.coordenadas
        : await obtenerCoordenadas(origen.direccion);
  
    const coordenadasDestino =
      destino.coordenadas?.length > 0
        ? destino.coordenadas
        : await obtenerCoordenadas(destino.direccion);
  
    const alto = parseFloat(envio.alto) || 0;
    const largo = parseFloat(envio.largo) || 0;
    const ancho = parseFloat(envio.ancho) || 0;
    const peso = parseFloat(envio.peso) || 0;
    const volumetrico = (alto * largo * ancho) / 5000;
  
    if (peso > 30 || volumetrico > 30) {
      toast.error("❌ Tu paquete excede el límite de 30 kg reales o volumétricos.");
      return;
    }

    if (mostrarMontoCOD && Number(envio.cod) > 3000) {
      toast.error("El monto máximo permitido para COD es $3000 MXN.");
      return;
    }    
  
    // 🔐 Obtener userId desde el token
    let userId = null;
    const token = localStorage.getItem("token");
    if (token) {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      userId = decodedPayload._id;
    }
  
    // Calcular tipo de pago dinámicamente
const tipoPagoFinal =
mostrarMontoCOD && Number(envio.cod) > 0 ? "COD" : "prepago";

// Construcción limpia del objeto para enviar al backend
const datos = {
userId,
origen: {
  direccion: origen.direccion,
  nombre: envio.remitente,
  telefono: envio.telRemitente,
  coordenadas: coordenadasOrigen,
  referencia: origen.referencia || "",
},
destino: {
  direccion: destino.direccion,
  nombre: envio.destinatario,
  telefono: envio.telDestinatario,
  coordenadas: coordenadasDestino,
  referencia: destino.referencia || "",
},
envio: {
  alto: envio.alto,
  largo: envio.largo,
  ancho: envio.ancho,
  peso: Math.max(parseFloat(envio.peso) || 0, parseFloat(pesoVolumetrico) || 0),
  contenido: envio.contenido,
  tipo: envio.tipo,
  cod: envio.cod,
  instrucciones: envio.instrucciones,
  remitente: envio.remitente,
  telRemitente: envio.telRemitente,
  direccionRemitente: origen.direccion,
  destinatario: envio.destinatario,
  telDestinatario: envio.telDestinatario,
  tipoPago: tipoPagoFinal, // ✅ Este valor ya es correcto y dinámico
},
};

if (!desglosePrecio) {
  toast.error("No puedes crear el pedido: zona sin cobertura o sin tarifa.");
  return;
}
  
    try {
      const res = await axios.post("/orders", datos, {
        headers: { Authorization: `Bearer ${token}` },
      });         
          
      toast.success(`Pedido creado. Guía: ${res.data.pedido.envio.numeroGuia}`);
      //navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar pedido.");
    }
  };  

  return (
    <PageTransition>
      <ResponsiveSection>
      <motion.div className="max-w-5xl mx-auto space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Crear Envío
</h1>

          <form onSubmit={handleAgregarPedido} className="space-y-6">
            {/* 📍 Datos de Recolección */}
<div className="space-y-2">
  <h2 className="text-xl font-semibold mb-2">📍 Datos de Recolección</h2>
  <button type="button" onClick={limpiarDatosRecoleccion} className="text-sm font-medium text-blue-600 hover:underline mb-2">
  Usar otros datos de recolección
</button>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input name="remitente" value={envio.remitente} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Nombre" className="input-style" required />
    <input name="telRemitente" value={envio.telRemitente} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Teléfono" className="input-style" required />
    <input name="emailRemitente" value={envio.emailRemitente} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Correo" className="input-style" required />
  </div>
  <AutocompleteDireccion
    value={origen}
    onChange={setOrigen}
    onConfirm={(info) => {
      setOrigen(info);
      setConfirmadoOrigen(true);
    }}
    placeholder="Dirección de Recolección"
  />
</div>

{/* 🎯 Datos de Destino */}
<div className="space-y-2 mt-6">
  <h2 className="text-xl font-semibold mb-2">🎯 Datos de Destino</h2>
  <input type="text" placeholder="Buscar cliente por nombre o teléfono..." value={busquedaCliente} onChange={(e) => setBusquedaCliente(e.target.value)} className="input-style" />
  {busquedaCliente && (
    <div className="bg-white rounded shadow border border-gray-200 max-h-48 overflow-y-auto">
      {clientesFrecuentes.filter(c =>
        c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        c.telefono.includes(busquedaCliente)
      ).map(c => (
        <button key={c._id} type="button" onClick={() => seleccionarClienteFrecuente(c)} className="w-full text-left px-4 py-2 hover:bg-gray-100">
          {c.nombre} — {c.telefono}
        </button>
      ))}
    </div>
  )}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input name="destinatario" value={envio.destinatario} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Nombre" className="input-style" required />
    <input name="telDestinatario" value={envio.telDestinatario} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Teléfono" className="input-style" required />
    <input name="emailDestinatario" value={envio.emailDestinatario} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Correo (opcional)" className="input-style" />
  </div>
  <AutocompleteDireccion
    value={destino}
    onChange={setDestino}
    onConfirm={(info) => {
      setDestino(info);
      setConfirmadoDestino(true);
    }}
    placeholder="Dirección de Destino"
  />
  <button type="button" onClick={guardarClienteFrecuente} className="text-sm font-medium text-blue-600 hover:underline">
  Guardar destinatario como cliente frecuente
</button>
</div>

{/* 📦 Detalles del Envío */}
<div className="space-y-2 mt-6">
  <h2 className="text-xl font-semibold mb-2">📦 Detalles del Envío</h2>
  <p className="text-sm text-gray-500">
  Peso volumétrico estimado: <span className="font-semibold">{pesoVolumetrico} kg</span>
</p>
{excesoPeso && (
  <p className="text-sm text-red-500 font-medium mt-1">
    ⚠️ Tu envío excede los 30 kg permitidos. Por favor, divídelo en dos o más paquetes para continuar.
  </p>
)}

  {/* Primer renglón: Dimensiones y peso */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {/* Alto */}
  <div className="relative">
    <input
      type="text"
      name="alto"
      inputMode="decimal"
      pattern="\d*"
      value={envio.alto}
      onChange={(e) => {
        const valor = e.target.value.replace(/\D/g, "");
        setEnvio({ ...envio, alto: valor });
      }}
      placeholder="Alto"
      className="input-style pr-12"
      required
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
  </div>

  {/* Largo */}
  <div className="relative">
    <input
      type="text"
      name="largo"
      inputMode="decimal"
      pattern="\d*"
      value={envio.largo}
      onChange={(e) => {
        const valor = e.target.value.replace(/\D/g, "");
        setEnvio({ ...envio, largo: valor });
      }}
      placeholder="Largo"
      className="input-style pr-12"
      required
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
  </div>

  {/* Ancho */}
  <div className="relative">
    <input
      type="text"
      name="ancho"
      inputMode="decimal"
      pattern="\d*"
      value={envio.ancho}
      onChange={(e) => {
        const valor = e.target.value.replace(/\D/g, "");
        setEnvio({ ...envio, ancho: valor });
      }}
      placeholder="Ancho"
      className="input-style pr-12"
      required
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
  </div>

  {/* Peso */}
  <div className="relative">
    <input
      type="text"
      name="peso"
      inputMode="decimal"
      pattern="\d*"
      value={envio.peso}
      onChange={(e) => {
        const valor = e.target.value.replace(/\D/g, "");
        setEnvio({ ...envio, peso: valor });
      }}
      placeholder="Peso"
      className="input-style pr-12"
      required
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
  </div>
</div>

  {/* Segundo renglón: Contenido y tipo */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <input name="contenido" value={envio.contenido} onChange={(e) => handleChange(e, envio, setEnvio)} placeholder="Contenido del paquete" className="input-style" required />
    <select name="tipo" value={envio.tipo} onChange={(e) => handleChange(e, envio, setEnvio)} className={`input-style ${!envio.tipo ? "text-gray-400" : "text-black"}`} required>
      <option value="" disabled hidden>Tipo de envío</option>
      <option value="express">Express (Mismo Día)</option>
      <option value="standard">Standard (Día Siguiente)</option>
      {/* <option value="fulfillment">Fulfillment</option> */}
    </select>
  </div>

  {/* Checkbox COD y monto */}
<div className="ml-[4px] flex items-center mt-4">
  <label htmlFor="cod" className="flex items-center space-x-3">
    <span className="relative flex items-center justify-center w-5 h-5">
      <input
        type="checkbox"
        id="cod"
        checked={mostrarMontoCOD}
        onChange={(e) => {
          setMostrarMontoCOD(e.target.checked);
          if (!e.target.checked) setEnvio({ ...envio, cod: "" });
        }}
        className="w-5 h-5 rounded-md border border-gray-300 bg-white text-blue-600 focus:ring-0 focus:outline-none appearance-none checked:bg-blue-600 checked:border-blue-600 peer"
      />
      <svg className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
    <span className="text-gray-400 text-base font-normal">¿Necesitas que cobremos al entregar?</span>
  </label>
</div>

{mostrarMontoCOD && (
  <div className="relative w-full">
    <input
      type="number"
      name="cod"
      value={envio.cod}
      onChange={(e) => {
        let valor = parseInt(e.target.value, 10);
      
        // Si el valor no es un número, lo dejamos vacío
        if (isNaN(valor)) {
          valor = "";
        } else {
          // Limitar el valor entre 1 y 3000
          if (valor < 1) valor = 1;
          if (valor > 3000) valor = 3000;
        }
      
        setEnvio((prev) => ({ ...prev, cod: valor }));
      }}      
      min="1"
      max="3000"
      step="1"
      required
      placeholder="$ Monto COD"
      className="input-style pr-12"
    />

    {/* ✅ Leyenda explicativa */}
    <p className="text-xs text-gray-500 mt-1">
      Puedes solicitarnos cobrar hasta <span className="font-semibold">$3,000 MXN</span> por entrega.
    </p>
  </div>
)}

    {/* Instrucciones */}
    <textarea
    name="instrucciones"
    value={envio.instrucciones}
    onChange={(e) => handleChange(e, envio, setEnvio)}
    placeholder="Instrucciones de entrega (opcional)"
    className="input-style"
    rows={3}
  />
</div>

<p className="text-sm text-gray-500 mb-2">
  📌 Verifica que el pin del mapa coincida con la dirección de destino. Si no es correcto, arrástralo manualmente.
</p>

<MapaEnvio
  destino={destino}
  onDestinoChange={(nuevaUbicacion) =>
    setDestino((prev) => ({ ...prev, ...nuevaUbicacion }))
  }
/>

{calculandoPrecio && <p>Calculando precio...</p>}

{desglosePrecio && (
  <div className="rounded bg-gray-100 p-3 mt-3 text-sm">
    <p>Zona: {desglosePrecio.zona}</p>
    <p>Costo de envío: ${desglosePrecio.precioBase} MXN</p>
    <p>Costo por COD: ${desglosePrecio.costoCOD} MXN</p>
    <p className="font-bold">Total: ${desglosePrecio.total} MXN</p>
  </div>
)}

<button
  type="submit"
  className="button-success w-full hover-zoom"
  disabled={excesoPeso}
>
  Crear Envío
</button>
</form> {/* ← cierre correcto del formulario */}

</motion.div>
</ResponsiveSection>
</PageTransition>
);
}

export default CrearPedido;

