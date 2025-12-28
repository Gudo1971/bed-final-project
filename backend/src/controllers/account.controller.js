import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ===========================================================
   Helper: Genereer JWT met actuele host-status
=========================================================== */
function generateToken(user, isHost) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      isHost,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* ===========================================================
   Become Host
   - haalt user op
   - checkt of host al bestaat
   - maakt host aan
   - genereert nieuwe token (isHost: true)
=========================================================== */
export async function becomeHost(req, res) {
  try {
    const userId = req.user.id;

    // User ophalen
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Gebruiker niet gevonden." });
    }

    // Bestaat host al?
    const existingHost = await prisma.host.findUnique({
      where: { email: user.email },
    });

    if (existingHost) {
      return res.status(400).json({ error: "Je hebt al een host account." });
    }

    // Host aanmaken
    const newHost = await prisma.host.create({
      data: {
        username: user.username,
        password: user.password,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        pictureUrl: user.pictureUrl,
        aboutMe: user.aboutMe,
      },
    });

    // Nieuwe token met isHost = true
    const newToken = generateToken(user, true);

    return res.status(201).json({
      message: "Je bent nu host.",
      host: newHost,
      token: newToken,
    });
  } catch (err) {
    console.error("❌ Error in becomeHost:", err);
    return res.status(500).json({
      error: "Er ging iets mis bij het aanmaken van het host account.",
    });
  }
}

/* ===========================================================
   Stop Host
   - checkt of host nog properties heeft
   - blokkeert netjes met duidelijke foutmelding
   - verwijdert host als er geen properties meer zijn
   - genereert nieuwe token (isHost: false)
=========================================================== */
export async function stopHost(req, res) {
  try {
    const user = req.user;

    // 1. Check of deze host nog properties heeft
    const activeProperties = await prisma.property.findMany({
      where: { hostEmail: user.email },
      select: { id: true },
    });

    if (activeProperties.length > 0) {
      return res.status(400).json({
        error:
          "U heeft nog een actieve property. Verwijder eerst uw actieve property.",
      });
    }

    // 2. Host verwijderen
    await prisma.host.delete({
      where: { email: user.email },
    });

    // 3. User opnieuw ophalen
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // 4. Nieuwe token met isHost = false
    const newToken = generateToken(updatedUser, false);

    return res.status(200).json({
      message: "Host account gedeactiveerd.",
      user: updatedUser,
      token: newToken,
    });
  } catch (err) {
    console.error("❌ Error in stopHost:", err);
    return res.status(500).json({
      error: "Er ging iets mis bij het deactiveren van het host account.",
    });
  }
}
