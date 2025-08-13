import * as SecureStore from "expo-secure-store";



export interface Notification {
  id: number;
  judul: string;
  tanggal: string;
  deskripsi: string;
  read?: boolean;
}

const NOTIF_KEY = "notifications";

export async function storeNotif(notif: Notification[]) {
  try {
    await SecureStore.setItemAsync(NOTIF_KEY, JSON.stringify(notif));
  } catch (error) {
    console.log("Error storing notif:", error);
  }
}

export async function getNotif(): Promise<Notification[] | null> {
  try {
    const result = await SecureStore.getItemAsync(NOTIF_KEY);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.log("Error getting notif:", error);
    return null;
  }
}

export async function markAsRead(id: number) {
  try {
    const list = await getNotif();
    if (!list) return;

    const updated = list.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );

    await storeNotif(updated);
  } catch (error) {
    console.log("Error marking notif as read:", error);
  }
}

export async function getUnreadCount(): Promise<number> {
  const list = await getNotif();
  return list ? list.filter((n) => !n.read).length : 0;
}