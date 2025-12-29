// ==============================================
// = API CLIENT (FETCH WRAPPER)                  =
// = JWT injectie + error handling + JSON parse  =
// ==============================================

export async function apiClient(url, options = {}) {
  // ==============================================
  // = TOKEN                                      =
  // ==============================================
  const token = localStorage.getItem("token");

  // ==============================================
  // = HEADERS                                    =
  // ==============================================
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Alleen JSON header toevoegen als body geen FormData is
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // ==============================================
  // = FINAL OPTIONS                              =
  // ==============================================
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

  // ==============================================
  // = FETCH REQUEST                              =
  // ==============================================
  let res;

  try {
    res = await fetch(url, finalOptions);
  } catch (err) {
    throw {
      error: "Kan geen verbinding maken met de server",
      network: true,
    };
  }

  // ==============================================
  // = JSON PARSING (safe)                        =
  // ==============================================
  let data = null;

  try {
    // 204 No Content → geen JSON
    if (res.status === 204) {
      data = {};
    } else {
      data = await res.json();
    }
  } catch {
    data = { error: "Onbekende fout" };
  }

  // ==============================================
  // = ERROR HANDLING                             =
  // ==============================================
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

  // ==============================================
  // = SUCCESS                                    =
  // ==============================================
  return data;
}
