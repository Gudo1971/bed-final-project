// ==============================================
// = API CLIENT (FETCH WRAPPER)                  =
// ==============================================

const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiClient(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const finalOptions = {
    method: options.method || "GET",
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
  };

  let res;

  try {
    res = await fetch(`${BASE_URL}${url}`, finalOptions);
  } catch (err) {
    throw {
      error: "Kan geen verbinding maken met de server",
      network: true,
    };
  }

  let data = null;

  try {
    if (res.status === 204) {
      data = {};
    } else {
      data = await res.json();
    }
  } catch {
    data = { error: "Onbekende fout" };
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
    }

    throw {
      status: res.status,
      error: data.error || "Er ging iets mis",
      details: data,
    };
  }

  return data;
}
