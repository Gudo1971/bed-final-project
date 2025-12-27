export async function apiClient(url, options = {}) {
  const res = await fetch(url, options);

  let data = null;

  try {
    data = await res.json();
  } catch {
    // Geen JSON body → fallback
    data = { error: "Unknown error" };
  }

  if (!res.ok) {
    throw new Error(data.error || "Er ging iets mis");
  }

  return data;
}
