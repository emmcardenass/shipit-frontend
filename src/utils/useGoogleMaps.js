// src/hooks/useGoogleMaps.js
import { useEffect, useState } from "react";

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  useEffect(() => {
    if (window.google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [apiKey]);

  return loaded;
}
