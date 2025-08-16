// ~/utils/axios.ts
import axios from "axios";
import { getUserToken } from "~/lib/auth/authStorage";

export const axiosUrl = "https://242781c138f6.ngrok-free.app/api";

const instance = axios.create({
  baseURL: axiosUrl,
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