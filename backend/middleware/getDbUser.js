import prisma from "../lib/prisma.js";

export async function getDbUser(req, res, next) {
  try {
    if (!req.auth || !req.auth.payload) {
      return res.status(401).json({ error: "Unauthorized: missing Auth0 payload" });
    }

    const auth0Id = req.auth.payload.sub;
    const { email, name, nickname, picture } = req.auth.payload;

    // Upsert voorkomt P2002 errors
    const user = await prisma.user.upsert({
      where: { auth0Id },
      update: {}, // niets updaten bij bestaande user
      create: {
        auth0Id,
        email: email || null,
        name: name || null,
        username: nickname || null,
        pictureUrl: picture || null,
      },
    });

    req.dbUser = user;
    next();
  } catch (error) {
    console.error("🔥 Error in getDbUser middleware:", error);
    res.status(500).json({ error: "Failed to resolve user" });
  }
}
