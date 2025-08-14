// ~/lib/notif/notifService.ts
import { axiosUrl } from "@/utils/axios";
import { storeNotif, getNotif as getStoredNotif, Notification } from "./notifStorage";

const API_URL = axiosUrl + "/pengumuman";

console.log("API URL:", API_URL);

export async function fetchNotif(reset: boolean = false): Promise<{ list: Notification[]; unread: number }> {
  try {
    const url = reset ? `${API_URL}?reset=1` : API_URL;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`API error ${res.status}`);
      return { list: [], unread: 0 };
    }

    const json = await res.json();

    if (!json.data || !Array.isArray(json.data)) {
      console.error("API format tidak sesuai", json);
      return { list: [], unread: 0 };
    }

    const apiList: Notification[] = json.data.map((item: any) => ({
      id: item.id,
      judul: item.judul,
      tanggal: item.tanggal,
      deskripsi: item.deskripsi,
      read: reset ? true : (item.is_read ?? false),
    }));

    // Merge dengan cache local untuk pertahankan status read
    const cached = await getStoredNotif();
    let merged: Notification[];

    if (cached && !reset) {
      const readIds = cached.filter((n) => n.read).map((n) => n.id);
      merged = apiList.map((item) => ({
        ...item,
        read: readIds.includes(item.id),
      }));
    } else {
      merged = apiList;
    }

    await storeNotif(merged);
    const unreadCount = merged.filter((n) => !n.read).length;

    return { list: merged, unread: unreadCount };
  } catch (error) {
    console.log("Error fetching notif:", error);
    return { list: [], unread: 0 };
  }
}

export async function getNotif(): Promise<{ list: Notification[]; unread: number }> {
  const local = await getStoredNotif();
  if (local && local.length > 0) {
    return { list: local, unread: local.filter((n) => !n.read).length };
  }
  return fetchNotif();
}

export { Notification };