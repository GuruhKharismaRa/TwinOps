import { apiFetch } from "@/services/api";

export async function getNotifications() {
  return await apiFetch(
    "/notifications"
  );
}

export async function markAsRead(id) {
  return await apiFetch(
    `/notifications/${id}/read`,
    {
      method: "POST"
    }
  );
}