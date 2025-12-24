

const BASE_URL = "http://localhost:3000/properties";

// GET /properties
export async function getAllProperties() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

// GET /properties/:id
export async function getPropertyById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
}

// POST /properties
export async function createProperty(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create property");
  return res.json();
}
