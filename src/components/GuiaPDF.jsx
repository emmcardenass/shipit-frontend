import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 10,
    fontSize: 8,
    lineHeight: 1.2,
    color: "#000",
    width: 288,
    height: 432,
    border: "1 solid #000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    marginBottom: 4,
  },
  logo: {
    width: 70,
    height: "auto",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0601FB",
    textAlign: "right",
  },
  block: {
    border: "1 solid #000",
    padding: 6,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 7,
  },
  value: {
    fontSize: 7,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  rightAlign: {
    textAlign: "right",
  },
  barcodeBlock: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    border: "1 solid #000",
    padding: 6,
    height: 60,
  },  
  barcode: {
    width: 220,
    height: 60,
    marginBottom: 4,
  },
  guideNumberBottom: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
  },
  footer: {
    borderTop: "1 solid #ccc",
    marginTop: 4,
    paddingTop: 2,
    fontSize: 6,
    textAlign: "center",
    color: "#555",
  },
});

export default function GuiaPDF({ envio }) {
  if (!envio) return null;

  const tipoEnvio = envio?.envio?.tipo?.toUpperCase() || "STANDARD";
  const titulo = tipoEnvio;
  const numeroGuia =
  envio?.envio?.numeroGuia ||
  envio?.numeroGuia ||
  envio?.envio?.tracking ||
  envio?.envio?.trackingNumber ||
  envio?.tracking ||
  envio?.trackingNumber ||
  "SIN-GUIA";
  const cod = envio?.envio?.tipoPago === "COD" ? envio?.envio?.cod : null;

  const alto = envio?.envio?.alto || 0;
  const largo = envio?.envio?.largo || 0;
  const ancho = envio?.envio?.ancho || 0;

  const barcodeURL = `https://barcode.tec-it.com/barcode.ashx?data=${numeroGuia}&code=Code128&translate-esc=false`;

  return (
    <Document>
      <Page size={{ width: 288, height: 432 }} style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image src="/logo-shipit.png" style={styles.logo} />
          <Text style={styles.title}>{titulo}</Text>
        </View>

        {/* Datos básicos */}
        <View style={styles.block}>
          <Text style={styles.label}>Remitente:</Text>
          <Text style={styles.value}>{`${envio?.origen?.nombre || "N/A"} / ${envio?.origen?.telefono || "N/A"}`}</Text>
          <Text style={styles.value}>{envio?.origen?.direccion || "N/A"}</Text>

          <Text style={styles.label}>Destinatario:</Text>
          <Text style={styles.value}>{`${envio?.destino?.nombre || "N/A"} / ${envio?.destino?.telefono || "N/A"}`}</Text>
          <Text style={styles.value}>{envio?.destino?.direccion || "N/A"}</Text>
        </View>

        {/* Detalles del paquete */}
        <View style={styles.block}>
        <View style={styles.row}>
  <View style={{ width: "48%" }}>
    <Text style={styles.label}>Contenido:</Text>
    <Text style={styles.value}>{envio?.envio?.contenido || "N/A"}</Text>
  </View>
  <View style={{ width: "48%" }}>
    <Text style={[styles.label, styles.rightAlign]}>Fecha:</Text>
    <Text style={[styles.value, styles.rightAlign]}>
      {new Date(envio.createdAt).toLocaleString()}
    </Text>
  </View>
</View>

<View style={styles.row}>
  <View style={{ width: "48%" }}>
    <Text style={styles.label}>Dimensiones:</Text>
    <Text style={styles.value}>{`${alto} x ${largo} x ${ancho} cm`}</Text>
  </View>
  <View style={{ width: "48%" }}>
    <Text style={[styles.label, styles.rightAlign]}>Peso:</Text>
    <Text style={[styles.value, styles.rightAlign]}>{envio?.envio?.peso || "0 kg"}</Text>
  </View>
</View>

          {cod && (
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Pago contra entrega (COD):</Text>
                <Text style={styles.value}>${cod}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Código de barras con número de guía alfanumérico */}
<View style={styles.barcodeBlock}>
  <Text style={[styles.guideNumberBottom, { color: "#0601FB", fontSize: 14 }]}>
    Guía: {numeroGuia}
  </Text>
</View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gracias por usar SHIP IT! – Envíos locales con estilo.</Text>
        </View>
      </Page>
    </Document>
  );
}
