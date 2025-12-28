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
  // = FINAL OPTIONS                              =
  // ==============================================
  const finalOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  // ==============================================
  // = FETCH REQUEST                              =
  // ==============================================
  let res;

  try {
    res = await fetch(url, finalOptions);
  } catch (err) {
    throw new Error("Kan geen verbinding maken met de server");
  }

  // ==============================================
  // = JSON PARSING                               =
  // ==============================================
  let data = null;

  try {
    data = await res.json();
  } catch {
    data = { error: "Onbekende fout" };
  }

  // ==============================================
  // = ERROR HANDLING                             =
  // ==============================================
  if (!res.ok) {
    // Automatisch uitloggen bij 401
    if (res.status === 401) {
      localStorage.removeItem("token");
    }

    throw new Error(data.error || "Er ging iets mis");
  }

  // ==============================================
  // = SUCCESS                                    =
  // ==============================================
  return data;
}
