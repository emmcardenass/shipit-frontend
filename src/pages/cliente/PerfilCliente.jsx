import { useEffect, useState } from "react";
import axios from "@/axios";
import toast from "react-hot-toast";
import PageTransition from "../../shipit-ui/pageTransition";
import AutocompleteDireccion from "../../components/AutocompleteDireccion";
import ResponsiveSection from "../../components/ResponsiveSection";

export default function PerfilCliente({ setFotoUsuario }) {
  const [perfil, setPerfil] = useState({
    name: "",
    email: "",
    telefono: "",
    direccion: "",
    foto: "",
    estimadoEnvios: ""
  });

  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setPerfil(res.data))
    .catch(() => toast.error("Error al cargar perfil"));
  }, []);

  const handleChange = (field, value) => {
    setPerfil((prev) => ({ ...prev, [field]: value }));
    setEditing(true);
  };

  const guardarCambios = async () => {
    const { name, telefono, direccion, estimadoEnvios } = perfil;

    if (!name || !telefono || !direccion) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await axios.patch("/users/profile", {
        name, telefono, direccion, estimadoEnvios
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Cambios guardados");

      localStorage.setItem("name", name);
      localStorage.setItem("telefono", telefono);
      localStorage.setItem("direccion", direccion);
      localStorage.setItem("email", perfil.email); // ✅ Línea agregada

      setEditing(false);
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      toast.error("No se pudo guardar");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Formato no válido. Solo se permiten imágenes (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen excede el límite de 5MB. Comprime o selecciona otra más ligera.");
      return;
    }

    reader.onloadend = async () => {
      try {
        const res = await axios.patch("/users/foto", {
          fotoBase64: reader.result
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerfil((prev) => ({ ...prev, foto: res.data.foto }));
        localStorage.setItem("foto", res.data.foto);
        if (setFotoUsuario) setFotoUsuario(res.data.foto);
        toast.success("Foto actualizada");
      } catch {
        toast.error("Ocurrió un error al subir la foto. Intenta nuevamente.");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSensitiveUpdate = async (type) => {
    const campo = type === "correo" ? "email" : "password";
    const label = type === "correo" ? "nuevo correo" : "nueva contraseña";
    const valor = prompt(`Ingresa tu ${label}:`);

    if (!valor) return;

    try {
      await axios.patch(`/users/${campo}`, { [campo]: valor }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${label.charAt(0).toUpperCase() + label.slice(1)} actualizado correctamente`);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch {
      toast.error("Error al actualizar");
    }
  };

  return (
    <PageTransition>
      <ResponsiveSection className="flex flex-col items-center justify-center min-h-[500px] space-y-6 text-center">
      <div className="flex-1 flex items-center justify-center">
  <h1 className="text-6xl md:text-7xl font-black text-black tracking-normal leading-tight">
    Mi Perfil
  </h1>
</div>


        <div className="space-y-4">
          <input
            type="text"
            value={perfil.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nombre completo"
            className="input-style"
          />

          <input
            type="text"
            value={perfil.telefono || ""}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="Teléfono"
            className="input-style"
          />

          <AutocompleteDireccion
            value={{ direccion: perfil.direccion }}
            onChange={(val) => handleChange("direccion", val.direccion)}
            placeholder="Dirección de recolección"
          />

          <input
            type="text"
            value={perfil.email || ""}
            disabled
            className="input-style bg-gray-200 dark:bg-zinc-700 text-gray-400 cursor-not-allowed"
            placeholder="Correo electrónico"
          />

          <input
            type="hidden"
            value={perfil.estimadoEnvios || ""}
            onChange={(e) => handleChange("estimadoEnvios", e.target.value)}
          />

          <div className="flex items-center space-x-4">
            {perfil.foto && (
              <img src={perfil.foto} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover" />
            )}
            <div className="space-y-1">
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input file:rounded-full file:border-0 file:bg-gray-200 file:px-4 file:py-1 file:text-sm file:text-gray-700 hover:file:bg-gray-300"
              />
              <p className="text-xs text-gray-500">
                Solo se permiten imágenes JPG, PNG o WebP. Tamaño máximo: 5MB.
              </p>
            </div>
          </div>

          {editing && (
            <button
              onClick={guardarCambios}
              className="w-full rounded-full px-4 py-2 text-white font-semibold shadow transition-all bg-green-600 hover:bg-green-700"
            >
              Guardar cambios
            </button>
          )}

          <div className="flex space-x-4 pt-2 justify-between">
            <button
              onClick={() => handleSensitiveUpdate("correo")}
              className="w-full rounded-full px-4 py-2 text-white font-semibold shadow transition-all bg-[#0601FB] hover:bg-blue-800"
            >
              Cambiar correo
            </button>
            <button
              onClick={() => handleSensitiveUpdate("contraseña")}
              className="w-full rounded-full px-4 py-2 text-white font-semibold shadow transition-all bg-[#FF7925] hover:bg-orange-600"
            >
              Cambiar contraseña
            </button>
          </div>
        </div>
      </ResponsiveSection>
    </PageTransition>
  );
}