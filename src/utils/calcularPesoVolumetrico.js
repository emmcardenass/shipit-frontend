export function calcularPesoVolumetrico({ alto, largo, ancho }) {
    const a = parseFloat(alto) || 0;
    const l = parseFloat(largo) || 0;
    const an = parseFloat(ancho) || 0;
    const volumetrico = (a * l * an) / 5000;
    return volumetrico.toFixed(2);
  }
  