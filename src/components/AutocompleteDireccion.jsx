import { useEffect, useRef, useState } from "react";

function AutocompleteDireccion({ value, onChange, placeholder, onConfirm }) {
  const [predicciones, setPredicciones] = useState([]);
  const [activo, setActivo] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const yaConfirmado = useRef(false); // previene múltiples confirmaciones

  useEffect(() => {
    if (window.google?.maps?.places) {
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
      } catch (error) {
        console.error("❌ Error al inicializar el AutocompleteService:", error);
      }
    }
  }, []);

  // ✅ Forzar confirmación si viene una dirección nueva externa (ej. cliente frecuente)
useEffect(() => {
  if (
    value?.direccion &&
    Array.isArray(value.coordenadas) &&
    value.coordenadas.length === 2
  ) {
    // ⚠️ Siempre se permite confirmar si los datos cambian externamente
    onConfirm?.(value);
    yaConfirmado.current = true;
  }
}, [JSON.stringify(value)]);

  useEffect(() => {
    if (!autocompleteService.current || !value?.direccion || value.direccion.length < 3) {
      setPredicciones([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: value.direccion,
        types: ["address"],
        componentRestrictions: { country: "mx" },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPredicciones(predictions);
          setActivo(true);
        } else {
          setPredicciones([]);
        }
      }
    );
  }, [value?.direccion]);

  const seleccionarDireccion = (descripcion, placeId) => {
    if (!placeId || !placesService.current) {
      const simpleDireccion = { direccion: descripcion };
      yaConfirmado.current = true;
      onChange(simpleDireccion);
      onConfirm?.(simpleDireccion);
      return;
    }

    placesService.current.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const direccionCompleta = {
          direccion: place.formatted_address,
          coordenadas: [
            place.geometry.location.lng(), // ✅ primero longitud
            place.geometry.location.lat(), // ✅ después latitud
          ],
        };        

        yaConfirmado.current = true;
        onChange(direccionCompleta);
        onConfirm?.(direccionCompleta);
      }
    });

    setPredicciones([]);
    setActivo(false);
  };

  const handleInputChange = (e) => {
    yaConfirmado.current = false;
    onChange({ ...value, direccion: e.target.value });
  };

  // 🧠 Confirmar automáticamente si ya hay coordenadas completas y aún no fue confirmado
  useEffect(() => {
    if (
      value?.direccion &&
      Array.isArray(value?.coordenadas) &&
      value.coordenadas.length === 2 &&
      !yaConfirmado.current
    ) {
      yaConfirmado.current = true;
      onConfirm?.(value);
    }
  }, [value?.direccion, value?.coordenadas]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value?.direccion || ""}
        onChange={handleInputChange}
        onFocus={() => setActivo(true)}
        placeholder={placeholder || "Escribe una dirección..."}
        className="w-full bg-white dark:bg-dark px-[20px] py-[12px] border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm transition-transform duration-200 hover:scale-[1.03] text-[16px] font-normal text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
      />

      {activo && predicciones.length > 0 && (
        <ul className="absolute z-10 bg-white dark:bg-dark border border-gray-300 dark:border-gray-700 mt-1 rounded-xl w-full shadow-lg overflow-hidden">
          {predicciones.map((prediccion) => (
            <li
              key={prediccion.place_id}
              onClick={() => seleccionarDireccion(prediccion.description, prediccion.place_id)}
              className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {prediccion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteDireccion;
