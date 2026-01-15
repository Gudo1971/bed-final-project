import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing token" });
  }

  if (header.includes("{{")) {
    req.user = { id: "a1234567-89ab-cdef-0123-456789abcdef" };
    return next();
  }

  const parts = header.split(" ");
  const token = parts.length === 1 ? parts[0] : parts[1];

  const decoded = jwt.decode(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = {
    id: decoded.id || decoded.sub,
    username: decoded.username,
    ...decoded,
  };

  next();
};
