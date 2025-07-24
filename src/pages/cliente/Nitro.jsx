import ResponsiveSection from "../../components/ResponsiveSection";
import PageTransition from "../../shipit-ui/pageTransition";

export default function Nitro() {
  return (
    <PageTransition>
      <ResponsiveSection>
      <h1 className="text-6xl font-black text-center tracking-tight leading-tight">
  NITRO
</h1>
        <p className="text-center text-gray-500">Una experiencia ultrarrápida está en camino... 🚧</p>
      </ResponsiveSection>
    </PageTransition>
  );
}
