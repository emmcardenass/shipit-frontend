import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL  // Este ya trae el /api al final
});

export default instance;
