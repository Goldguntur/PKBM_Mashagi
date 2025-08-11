import axios from "axios";
import { getUserToken } from "~/lib/auth/authStorage";

const instance = axios.create({
  baseURL: "https://90d1ca8a7d54.ngrok-free.app/api"
});

instance.interceptors.request.use(async (config) => {
  const token = await getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;