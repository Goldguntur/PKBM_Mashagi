import axios from "axios";
import { getUserToken } from "~/lib/auth/authStorage";

export const axiosUrl = "https://881ff93a3e53.ngrok-free.app/api";

const instance = axios.create({
  baseURL: axiosUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  return getUserToken().then((token) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "➡️ Request:",
      config.method?.toUpperCase(),
      config.baseURL + config.url,
      config.data
    );

    return config;
  });
});

instance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log(
      "❌ Error Response:",
      error.config?.url,
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default instance;