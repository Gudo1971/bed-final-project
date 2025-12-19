import prisma from "../lib/prisma.js";

export async function getDbUser(req, res, next) {
  try {
    const auth0Id = req.auth.payload.sub;

    let user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id,
          email: req.auth.payload.email || null,
          name: req.auth.payload.name || null,
          username: req.auth.payload.nickname || null,
          pictureUrl: req.auth.payload.picture || null,
        },
      });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error("Error in getDbUser middleware:", error);
    res.status(500).json({ error: "Failed to resolve user" });
  }
}
