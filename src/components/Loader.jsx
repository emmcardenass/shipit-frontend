import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );
}

export default Loader;
