import { useEffect, useRef } from 'react';

function Map({ center = { lat: 25.6866, lng: -100.3161 }, zoom = 13 }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });

    new window.google.maps.Marker({
      position: center,
      map: map,
    });

  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-lg shadow-lg"
    ></div>
  );
}

export default Map;
