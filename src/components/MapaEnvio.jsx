import { useEffect, useRef, useState } from "react";

function MapaEnvio({ destino, onDestinoChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapaListo, setMapaListo] = useState(false);

  useEffect(() => {
    if (!window.google) return;

    const mapa = new window.google.maps.Map(document.getElementById("mapa-envio"), {
      center: { lat: 25.6866, lng: -100.3161 },
      zoom: 15,
      disableDefaultUI: true,
      styles: [], // Estilo claro (sin custom styles)
    });

    mapRef.current = mapa;

    const marker = new window.google.maps.Marker({
      map: mapa,
      draggable: true,
      position: { lat: 25.6866, lng: -100.3161 },
    });

    markerRef.current = marker;

    // ✅ Listener de dragend solo aquí
    markerRef.current.addListener("dragend", (e) => {
      const nuevaPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: nuevaPos }, (results, status) => {
        if (status === "OK" && results[0]) {
          onDestinoChange({
            direccion: results[0].formatted_address,
            coordenadas: [nuevaPos.lng, nuevaPos.lat], // orden correcto lng, lat
          });
        } else {
          console.error("No se pudo obtener dirección:", status);
        }
      });
    });

    setMapaListo(true);
  }, []);

  useEffect(() => {
    if (
      mapaListo &&
      mapRef.current &&
      markerRef.current &&
      Array.isArray(destino?.coordenadas) &&
      destino.coordenadas.length === 2
    ) {
      const [lng, lat] = destino.coordenadas;
      const nuevaUbicacion = new window.google.maps.LatLng(lat, lng);
      mapRef.current.setZoom(18);
      mapRef.current.setCenter(nuevaUbicacion);
      markerRef.current.setPosition(nuevaUbicacion);
    }
  }, [destino, mapaListo]);

  const centrarMapa = () => {
    if (
      mapRef.current &&
      Array.isArray(destino?.coordenadas) &&
      destino.coordenadas.length === 2
    ) {
      const [lng, lat] = destino.coordenadas;
      const ubicacion = new window.google.maps.LatLng(lat, lng);
      mapRef.current.panTo(ubicacion);
      mapRef.current.setZoom(18);
    }
  };

  return (
    <div className="relative mt-6">
      <div
        id="mapa-envio"
        className="rounded-xl overflow-hidden shadow-lg backdrop-blur-md"
        style={{ width: "100%", height: "300px" }}
      ></div>

      {/* 🧭 Botón para centrar */}
      <button
        onClick={centrarMapa}
        className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-sm text-gray-800 px-3 py-1 rounded-lg shadow-md backdrop-blur-lg transition"
      >
        Centrar mapa
      </button>
    </div>
  );
}

export default MapaEnvio;
