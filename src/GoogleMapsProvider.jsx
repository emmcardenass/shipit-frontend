import { LoadScriptNext } from "@react-google-maps/api"; // ⬅️ cambia LoadScript por LoadScriptNext

const libraries = ["places"];

function GoogleMapsProvider({ children }) {
  return (
    <LoadScriptNext
      googleMapsApiKey="AIzaSyChICk7EBnjDMBmkAnREOEu9N0GjWmIlyE"
      libraries={libraries}
    >
      {children}
    </LoadScriptNext>
  );
}

export default GoogleMapsProvider;
