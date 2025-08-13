// ~/utils/axios.ts
import axios from "axios";
import { getUserToken } from "~/lib/auth/authStorage";

const instance = axios.create({
  baseURL: "https://3cb598490aa2.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;