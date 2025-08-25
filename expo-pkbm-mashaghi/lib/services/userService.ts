// ~/lib/services/userService.ts
import axios from "axios";
import instance, { axiosUrl } from "@/utils/axios";
import { getUserToken } from "../auth/authStorage";

export type RoleKey = "pesertaDidik" | "guru" | "tenagaPendidik";

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleKey;
}

export interface Kelas {
  id: number;
  nama_kelas: string;
}

export interface Mapel {
  id: number;
  nama_mapel: string;
}

export type MutasiJenis =
  | "murid_pindah_kelas"
  | "murid_naik_kelas"
  | "murid_lulus"
  | "murid_keluar"
  | "guru_pindah_mapel"
  | "guru_keluar"
  | "tendik_keluar";

// Create Axios instance
const API = axios.create({ baseURL: axiosUrl });

// Add token dynamically for each request
API.interceptors.request.use(async (config) => {
  const token = await getUserToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------- Users --------------------

// Fetch all users by role
export const fetchUsersByRole = async (role: RoleKey): Promise<User[]> => {
  const { data } = await API.get(`/users?role=${role}`);
  return data;
};

export async function fetchUserDetail(id: number) {
  console.log("Searching Fetch user detail:", id); // id yang dilempar
  const res = await instance.get(`/users/${id}`);
  console.log("Good Response fetchUserDetail:", res.data);
  return res.data;
}
// -------------------- Kelas --------------------

export async function fetchKelas() {
  console.log("🔍 Fetch kelas");
  const res = await instance.get("/kelas");
  console.log("Good Response fetchKelas:", res.data);
  return res.data;
}

export async function fetchMapels() {
  console.log("🔍 Fetch mapels");
  const res = await instance.get("/mapels");
  console.log("Good Response fetchMapels:", res.data);
  return res.data;
}

// Create new mutasi
export const buatMutasi = async (payload: {
  user_id: number;
  jenis: MutasiJenis;
  kelas_tujuan_id?: number | null;
  mapel_tujuan_id?: number | null;
  alasan?: string | null;
}) => {
  const { data } = await API.post("/mutasi", payload);
  return data;
};

export const setujuiMutasi = async (mutasiId: number) => {
  const { data } = await API.put(`/mutasi/${mutasiId}`, { status: "disetujui" });
  return data;
};