import axios from "~/utils/axios";
import { saveTokenAndUser, saveUser } from "./authStorage";

export async function login(email, password, role, kelas) {
  try {
    const response = await axios.post("/login", {
      email,
      password,
      role,
      kelas
    });

    console.log("Login response:", response.data);

    const { token, user } = response.data;
    await saveTokenAndUser(token, user);

    return user;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function register(email, password, username, role, kelas, nisn, nik, no_wa, name, password_confirmation, tanggal_lahir) {
  try {
    const response = await axios.post("/register", {
      email,
      password,
      username,
      role,
      kelas,
      nisn,
      nik,
      no_wa,
      name,
      password_confirmation,
      tanggal_lahir
    });

    console.log("Register response:", response.data);
    const user = response.data;
     await saveUser(user);
    return user;
  } catch (error) {
    console.error("Register error:", error.response?.data || error);
    const message =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : JSON.stringify(error.response?.data?.message || error.response?.data || {});
    throw new Error(message || "Registration failed");
  }
}