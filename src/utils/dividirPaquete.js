// utils/dividirPaquete.js

export function dividirPaquete({ pesoTotal, dimensiones }) {
    const LIMITE_KG = 30;
  
    const { alto, largo, ancho } = dimensiones;
    const volumenTotal = alto * largo * ancho;
    const subPaquetes = [];
  
    let pesoRestante = pesoTotal;
    let volumenRestante = volumenTotal;
  
    while (pesoRestante > 0) {
      const pesoActual = pesoRestante > LIMITE_KG ? LIMITE_KG : pesoRestante;
      const proporcion = pesoActual / pesoTotal;
  
      const subAlto = Math.round(alto * proporcion);
      const subLargo = Math.round(largo * proporcion);
      const subAncho = Math.round(ancho * proporcion);
  
      subPaquetes.push({
        peso: parseFloat(pesoActual.toFixed(2)),
        dimensiones: {
          alto: subAlto,
          largo: subLargo,
          ancho: subAncho
        }
      });
  
      pesoRestante -= pesoActual;
      volumenRestante -= subAlto * subLargo * subAncho;
    }
  
    return subPaquetes;
  }
  