const API_BASE_URL =
    "http://localhost:8001";


export async function apiFetch(

    endpoint,

    options = {}
) {

    const token =
        localStorage.getItem(
            "access_token"
        );

    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})
    };

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;
    }

    const response = await fetch(

        `${API_BASE_URL}${endpoint}`,

        {

            ...options,

            headers
        }
    );

    return response.json();
}