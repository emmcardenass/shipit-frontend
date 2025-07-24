import ResponsiveSection from "../../components/ResponsiveSection";
import PageTransition from "../../shipit-ui/pageTransition";

export default function Nova() {
  return (
    <PageTransition>
      <ResponsiveSection>
      <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  ¡Hola, soy NOVA!
</h1>
        <p className="text-center text-gray-500">N.O.V.A. - Neural Operational Virtual Assistant. Tu copiloto pronto estará disponible aquí. 🚧</p>
      </ResponsiveSection>
    </PageTransition>
  );
}
