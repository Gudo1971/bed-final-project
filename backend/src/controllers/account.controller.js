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
=========================================================== */
export async function becomeHost(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Gebruiker niet gevonden." });
    }

    const existingHost = await prisma.host.findUnique({
      where: { email: user.email },
    });

    if (existingHost) {
      return res.status(400).json({ error: "Je hebt al een host account." });
    }

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
=========================================================== */
export async function stopHost(req, res) {
  try {
    const user = req.user;

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

    await prisma.host.delete({
      where: { email: user.email },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

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

/* ===========================================================
   CHECK EMAIL BESTAAT?
=========================================================== */
export async function checkEmailExists(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is verplicht." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({
        error: "We hebben geen account gevonden met dit email adres",
      });
    }

    return res.status(200).json({ exists: true });
  } catch (err) {
    console.error("❌ Error in checkEmailExists:", err);
    return res.status(500).json({
      error: "Er ging iets mis bij het controleren van het email adres.",
    });
  }
}
