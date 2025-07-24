import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "@/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      const rol = usuario?.role;

      if (token && rol) {
        redirigirPorRol(rol);
      }
    } catch (error) {
      console.warn("⚠️ Error leyendo localStorage:", error);
    }
  }, []);

  const redirigirPorRol = (rol) => {
    if (rol === "cliente") navigate("/dashboard-cliente");
    else if (rol === "repartidor") navigate("/dashboard-repartidor");
    else if (rol === "admin") navigate("/dashboard-admin");
    else if (rol === "superadmin") navigate("/superadmin/dashboard");
    else toast.error("Rol no reconocido");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`/users/login`, { email, password });
      const { token, role, name, foto } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify({ role, name, foto }));

      redirigirPorRol(role);
    } catch (error) {
      toast.error(error.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-darkBackground dark:to-gray-900 p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 space-y-6"
      >
        <h1 className="text-6xl md:text-7xl font-black text-black dark:text-white tracking-normal leading-tight text-center">
          Inicia Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-style"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-style pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="text-right text-sm">
          <Link to="/recuperar-password" className="text-[#0601FB] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0601FB] hover:bg-[#0601FB]/90 text-white py-3 rounded-xl text-lg transition-all"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
