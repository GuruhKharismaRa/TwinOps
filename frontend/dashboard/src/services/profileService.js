import { apiFetch } from "./api";

export async function getProfile() {
  return await apiFetch("/auth/me");
}

export async function updateProfile(data) {
  return await apiFetch(
    "/auth/profile",
    {
      method: "PUT",
      body: JSON.stringify(data)
    }
  );
}

export async function changePassword(data) {
  return await apiFetch(
    "/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}