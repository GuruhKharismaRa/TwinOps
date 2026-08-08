import { apiFetch } from "./api";

export async function search(keyword) {

    return await apiFetch(
        `/search?q=${encodeURIComponent(keyword)}`
    );

}