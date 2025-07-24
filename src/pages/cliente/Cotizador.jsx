import { useState, useEffect } from "react";
import PageTransition from "../../shipit-ui/pageTransition";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import AutocompleteDireccion from "../../components/AutocompleteDireccion";
import MapaEnvio from "../../components/MapaEnvio";
import ResponsiveSection from "../../components/ResponsiveSection";
import axios from "@/axios";
import toast from "react-hot-toast";
import { calcularPesoVolumetrico } from "@/utils/calcularPesoVolumetrico";

function Cotizador() {
  const [origen, setOrigen] = useState({ direccion: "", coordenadas: null });
  const [destino, setDestino] = useState({ direccion: "", coordenadas: null });
  const [peso, setPeso] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [tipoEnvio, setTipoEnvio] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [vibrar, setVibrar] = useState(false);
  const [mostrarMontoCOD, setMostrarMontoCOD] = useState(false);
  const [cod, setCod] = useState("");

  const volumetrico = calcularPesoVolumetrico({ alto, largo, ancho });

  useEffect(() => {
    const pesoReal = parseFloat(peso) || 0;
    const pesoVol = parseFloat(volumetrico) || 0;
    const excedeLimite = pesoReal > 30 || pesoVol > 30;

    if (excedeLimite) {
      setVibrar(true);
      setTimeout(() => setVibrar(false), 1000);
    }
  }, [peso, alto, largo, ancho, volumetrico]);

  const cotizarEnvio = async (e) => {
    e.preventDefault();

    if (!origen.coordenadas || !destino.coordenadas || !peso || !largo || !ancho || !alto || !tipoEnvio) {
      toast.error("Por favor llena todos los campos.");
      return;
    }

    try {
      const res = await axios.post("/tarifas/calcular-precio", {
        destino,
        envio: {
          peso: Math.max(parseFloat(peso) || 0, parseFloat(volumetrico) || 0),
          tipo: tipoEnvio,
          cod: mostrarMontoCOD ? parseInt(cod) || 0 : 0
        }
      });

      setResultado({
        origen: origen.direccion,
        destino: destino.direccion,
        peso,
        largo,
        ancho,
        alto,
        tipoEnvio,
        desglose: res.data
      });

      setMostrarConfirmacion(true);
    } catch (error) {
      console.error("Error al calcular precio:", error);
      toast.error("Error al calcular el precio.");
    }
  };

  return (
    <PageTransition>
      <ResponsiveSection>
        <div className="max-w-5xl mx-auto p-8 space-y-6">
        <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  Cotizar Envío
</h1>

          <form onSubmit={cotizarEnvio} className="space-y-6">
            <div className="space-y-4">
              <AutocompleteDireccion
                value={origen}
                onChange={setOrigen}
                placeholder="Dirección de Recolección"
              />
              <AutocompleteDireccion
                value={destino}
                onChange={setDestino}
                placeholder="Dirección de Destino"
              />
            </div>

            <p className="text-sm text-gray-500">
              Peso volumétrico estimado: <span className="font-semibold">{volumetrico} kg</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  name="alto"
                  inputMode="decimal"
                  pattern="\d*"
                  value={alto}
                  onChange={(e) => setAlto(e.target.value.replace(/\D/g, ""))}
                  placeholder="Alto (cm)"
                  className="input-style pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="largo"
                  inputMode="decimal"
                  pattern="\d*"
                  value={largo}
                  onChange={(e) => setLargo(e.target.value.replace(/\D/g, ""))}
                  placeholder="Largo (cm)"
                  className="input-style pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="ancho"
                  inputMode="decimal"
                  pattern="\d*"
                  value={ancho}
                  onChange={(e) => setAncho(e.target.value.replace(/\D/g, ""))}
                  placeholder="Ancho (cm)"
                  className="input-style pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="peso"
                  inputMode="decimal"
                  pattern="\d*"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value.replace(/\D/g, ""))}
                  placeholder="Peso (kg)"
                  className="input-style pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
              </div>
            </div>

            {(() => {
              const pesoReal = parseFloat(peso) || 0;
              const pesoVol = parseFloat(volumetrico) || 0;
              const excedeLimite = pesoReal > 30 || pesoVol > 30;
              return (
                <p
                  className={`text-xs mt-1 transition-all ${
                    excedeLimite ? "text-red-500" : "text-gray-500"
                  } ${vibrar ? "animate-vibrar" : ""}`}
                >
                  Cotiza envíos para paquetes de hasta{" "}
                  <span className="font-semibold">30kg reales o volumétricos</span>.
                </p>
              );
            })()}

            <div className="relative w-full mt-4">
              <select
                value={tipoEnvio}
                onChange={(e) => setTipoEnvio(e.target.value)}
                className={`appearance-none input-style w-full pl-4 pr-10 p-3 rounded-md bg-white/70 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0 ${
                  !tipoEnvio ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled hidden className="!text-gray-400">
                  Selecciona tipo de envío
                </option>
                <option value="express">Express (Mismo Día)</option>
                <option value="standard">Standard (Día Siguiente)</option>
                {/* <option value="fulfillment">Fulfillment</option> */}
              </select>
            </div>

            {/* ✅ Checkbox COD */}
            <div className="ml-[4px] flex items-center mt-4">
              <label htmlFor="cod" className="flex items-center space-x-3">
                <span className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    id="cod"
                    checked={mostrarMontoCOD}
                    onChange={(e) => {
                      setMostrarMontoCOD(e.target.checked);
                      if (!e.target.checked) setCod("");
                    }}
                    className="w-5 h-5 rounded-md border border-gray-300 bg-white text-blue-600 focus:ring-0 focus:outline-none appearance-none checked:bg-blue-600 checked:border-blue-600 peer"
                  />
                  <svg
                    className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-400 text-base font-normal">
                  ¿Necesitas que cobremos al entregar?
                </span>
              </label>
            </div>

            {/* ✅ Campo COD */}
            {mostrarMontoCOD && (
              <div className="relative w-full">
                <input
                  type="number"
                  name="cod"
                  value={cod}
                  onChange={(e) => {
                    let valor = parseInt(e.target.value, 10);

                    if (isNaN(valor)) {
                      valor = "";
                    } else {
                      if (valor < 1) valor = 1;
                      if (valor > 3000) valor = 3000;
                    }

                    setCod(valor);
                  }}
                  min="1"
                  max="3000"
                  step="1"
                  required
                  placeholder="$ Monto COD"
                  className="input-style pr-12"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Puedes solicitarnos cobrar hasta{" "}
                  <span className="font-semibold">$3,000 MXN</span> por entrega.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="button-success hover:scale-105 transition-transform duration-300 w-full py-3 rounded-full text-white text-lg font-semibold"
            >
              Calcular Cotización
            </button>
          </form>

          <MapaEnvio
            origen={origen}
            destino={destino}
            activarRuta={origen.coordenadas && destino.coordenadas}
          />

          {mostrarConfirmacion && resultado && (
            <div className="rounded bg-gray-100 p-4 mt-4 space-y-2">
              <h2 className="text-lg font-semibold text-blue-600">Resultado de Cotización</h2>
              <p>Zona: {resultado.desglose.zona}</p>
              <p>Costo de envío: ${resultado.desglose.precioBase} MXN</p>
              <p>Costo por COD: ${resultado.desglose.costoCOD} MXN</p>
              <p className="font-bold">Total: ${resultado.desglose.total} MXN</p>
            </div>
          )}
        </div>
      </ResponsiveSection>
    </PageTransition>
  );
}

export default Cotizador;
