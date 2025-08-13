import axios from "~/utils/axios";
import { saveTokenAndUser } from "./authStorage";

export async function login(email, password, role) {
  try {
    const response = await axios.post("/login", {
      email,
      password,
      role,
    });

    console.log("Login response:", response.data);

    const { token, user } = response.data;
    await saveTokenAndUser(token, user);

    return user;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function register() {
  try {
    const response = await axios.post("/register", {});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}