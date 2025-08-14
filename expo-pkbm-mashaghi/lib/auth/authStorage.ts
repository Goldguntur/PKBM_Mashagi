// ~/lib/auth/authStorage.ts
import * as SecureStore from "expo-secure-store";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "kepalaSekolah" | "guru" | "pesertaDidik" | "tenagaPendidik";
};

export async function saveTokenAndUser(token: string, user: User) {
  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  if (user?.role) {
    await SecureStore.setItemAsync("role", user.role);
  }
}

export async function saveUser(user: User) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  if (user?.role) {
    await SecureStore.setItemAsync("role", user.role);
  }
}

export async function getUser(): Promise<User | null> {
  const user = await SecureStore.getItemAsync("user");
  return user ? (JSON.parse(user) as User) : null;
}

export async function getUserRole(): Promise<User["role"] | null> {
  return await SecureStore.getItemAsync("role") as User["role"];
}

export async function getUserToken(): Promise<string | null> {
  return await SecureStore.getItemAsync("token");
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("role");
}