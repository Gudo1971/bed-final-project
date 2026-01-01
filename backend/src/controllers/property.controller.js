// ==============================================
// = PROPERTY CONTROLLER — WINC TEST VERSION    =
// ==============================================

import prisma from "../lib/prisma.js";

/* ============================================================
   GET ALL PROPERTIES
============================================================ */
export const getProperties = async (req, res) => {
  const properties = await prisma.property.findMany();
  return res.status(200).json(properties);
};

/* ============================================================
   GET PROPERTY BY ID
============================================================ */
export const getProperty = async (req, res) => {
  const { id } = req.params;

  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    return res.status(404).send(); // WINC expects empty body
  }

  return res.status(200).json(property);
};

/* ============================================================
   CREATE PROPERTY
============================================================ */
export const createProperty = async (req, res) => {
  const { title, location, pricePerNight } = req.body;

  // WINC: empty or invalid body → 400 + empty body
  if (!title || !location || !pricePerNight) {
    return res.status(400).send();
  }

  await prisma.property.create({
    data: req.body,
  });

  // WINC: 201 + empty body
  return res.status(201).send();
};

/* ============================================================
   UPDATE PROPERTY
============================================================ */
export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    return res.status(404).send();
  }

  // WINC: invalid body → 400 + empty body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send();
  }

  await prisma.property.update({
    where: { id },
    data: req.body,
  });

  // WINC: 200 + empty body
  return res.status(200).send();
};

/* ============================================================
   DELETE PROPERTY
============================================================ */
export const deleteProperty = async (req, res) => {
  const { id } = req.params;

  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    return res.status(404).send();
  }

  await prisma.property.delete({ where: { id } });

  // WINC: 200 + empty body
  return res.status(200).send();
};
