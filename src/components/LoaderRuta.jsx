// src/components/LoaderRuta.jsx
function LoaderRuta() {
    return (
      <div className="flex flex-col items-center justify-center w-full h-72 bg-white/70 dark:bg-gray-800 rounded-lg shadow-lg animate-pulse">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Calculando ruta...
        </p>
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  export default LoaderRuta;
  