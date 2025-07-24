// src/pages/Register.jsx
import { useState } from "react";
import axios from "@/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import AutocompleteDireccion from "../components/AutocompleteDireccion";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    direccion: "",
    enviosLocales: "",
    enviosNacionales: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDireccion = (value) => {
    setForm({ ...form, direccion: value });
  };

  const evaluarSeguridad = (password) => {
    if (!password) return "";
    if (password.length < 6) return "débil";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "fuerte";
    return "media";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Limpia token viejo antes de registrar
    localStorage.removeItem("token");

    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!aceptoTerminos) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        name: `${form.name} ${form.apellido1} ${form.apellido2 || ""}`.trim(),
        email: form.email,
        password: form.password,
        telefono: form.telefono,
        direccion: form.direccion?.direccion || "",
        estimadoEnvios: `Locales: ${form.enviosLocales}, Nacionales: ${form.enviosNacionales}`
      };

      console.log("📦 Enviando datos:", formData);

await axios.post("/users/register", formData);
toast.success("¡Tu cuenta fue creada con éxito!");
navigate("/login");

    } catch (err) {
      console.error(err);
    
      // Si el backend manda un mensaje específico, úsalo:
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error al registrar");
      }
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-darkBackground dark:to-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 space-y-6"
      >
        <h1 className="text-6xl md:text-7xl font-black text-black dark:text-white tracking-normal leading-tight text-center">
  Crear Cuenta
</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="input-style"
            required
          />
          <input
            type="text"
            name="apellido1"
            value={form.apellido1}
            onChange={handleChange}
            placeholder="Primer Apellido"
            className="input-style"
            required
          />
          <input
            type="text"
            name="apellido2"
            value={form.apellido2}
            onChange={handleChange}
            placeholder="Segundo Apellido (opcional)"
            className="input-style"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="input-style"
            required
          />
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Número de teléfono"
            className="input-style"
            required
          />

          {/* Dirección - ocupa toda la fila */}
          <AutocompleteDireccion
            value={form.direccion}
            onChange={handleDireccion}
            placeholder="Dirección de recolección favorita"
            className="input-style col-span-1 md:col-span-2"
          />

          {/* Envíos Locales - ocupa toda la fila */}
          <select
            name="enviosLocales"
            value={form.enviosLocales}
            onChange={handleChange}
            className="input-style col-span-1 md:col-span-2"
            required
          >
            <option value="" disabled hidden>¿Cuántos envíos locales realizas al mes?</option>
            <option value="Aún no realizo envíos">Aún no realizo envíos</option>
            <option value="1-15">1-15</option>
            <option value="15-30">15-30</option>
            <option value="30-50">30-50</option>
            <option value="50-100">50-100</option>
            <option value="100+">Más de 100</option>
          </select>

          {/* Envíos Nacionales - ocupa toda la fila */}
          <select
            name="enviosNacionales"
            value={form.enviosNacionales}
            onChange={handleChange}
            className="input-style col-span-1 md:col-span-2"
            required
          >
            <option value="" disabled hidden>¿Cuántos envíos nacionales realizas al mes?</option>
            <option value="Aún no realizo envíos">Aún no realizo envíos</option>
            <option value="1-15">1-15</option>
            <option value="15-30">15-30</option>
            <option value="30-50">30-50</option>
            <option value="50-100">50-100</option>
            <option value="100+">Más de 100</option>
          </select>

          {/* Leyenda */}
          <p className="text-xs text-gray-500 mt-1 col-span-1 md:col-span-2">
            Esta información nos ayuda a ofrecerte tarifas personalizadas según tu volumen de envíos.
          </p>

          {/* Contraseña */}
          <div className="relative col-span-1 md:col-span-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, password: val });
                setPasswordStrength(evaluarSeguridad(val));
              }}
              placeholder="Contraseña"
              className="input-style pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {form.password && (
            <div className="col-span-1 md:col-span-2 -mt-3">
              <div className="h-2 rounded-full w-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className={`
                    h-full transition-all duration-300 rounded-full
                    ${passwordStrength === "débil" ? "w-1/4 bg-red-500" : ""}
                    ${passwordStrength === "media" ? "w-2/4 bg-yellow-500" : ""}
                    ${passwordStrength === "fuerte" ? "w-full bg-green-500" : ""}
                  `}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 italic">
                Seguridad: {passwordStrength}
              </p>
            </div>
          )}

          {/* Confirmar Contraseña */}
          <div className="relative col-span-1 md:col-span-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              className={`input-style pr-10 ${
                form.confirmPassword && form.password !== form.confirmPassword ? "border-red-500" : ""
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Checkbox Acepto términos */}
        <div className="flex items-start gap-3 col-span-1 md:col-span-2 mt-2">
        <input
  type="checkbox"
  checked={aceptoTerminos}
  onChange={(e) => setAceptoTerminos(e.target.checked)}
  className="mt-1 w-4 h-4 border border-gray-300 rounded-sm accent-[#0601FB]"
  required
/>
            <label className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
              Acepto los términos y condiciones de uso.
            </label>
          </div>

          <button
  type="submit"
  className="w-full bg-[#0601FB] hover:bg-[#0601FB]/90 text-white py-3 rounded-xl text-lg transition-all"
  disabled={loading}
>
  {loading ? "Registrando..." : "Registrarse"}
</button>
      </form>
    </div>
  );
}
