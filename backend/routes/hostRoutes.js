import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";

const router = express.Router();

/* -------------------------------------------
   GET /hosts
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const hosts = await prisma.host.findMany();
    res.json(hosts);
  } catch (error) {
    console.error("Error fetching hosts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /hosts/:id/properties  (specifiek → boven /:id)
------------------------------------------- */
router.get("/:id/properties", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid host ID format" });
  }

  try {
    const host = await prisma.host.findUnique({ where: { id } });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const properties = await prisma.property.findMany({
      where: { hostId: id },
    });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties for host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /hosts/:id
------------------------------------------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid host ID format" });
  }

  try {
    const host = await prisma.host.findUnique({ where: { id } });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.json(host);
  } catch (error) {
    console.error("Error fetching host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   POST /hosts
------------------------------------------- */
router.post("/", async (req, res) => {
  const { name, email, phoneNumber, pictureUrl } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const existing = await prisma.host.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newHost = await prisma.host.create({
      data: { name, email, phoneNumber, pictureUrl },
    });

    res.status(201).json(newHost);
  } catch (error) {
    console.error("Error creating host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   PUT /hosts/:id
------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, pictureUrl } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid host ID format" });
  }

  try {
    const updated = await prisma.host.update({
      where: { id },
      data: { name, email, phoneNumber, pictureUrl },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating host:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Host not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   DELETE /hosts/:id
------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid host ID format" });
  }

  try {
    await prisma.host.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting host:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Host not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
