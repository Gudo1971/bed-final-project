// ==============================================
// = HOST CONTROLLER — WINC TEST VERSION        =
// ==============================================

import prisma from "../lib/prisma.js";

/* ============================================================
   GET ALL HOSTS
============================================================ */
export const getAllHostsController = async (req, res) => {
  const hosts = await prisma.host.findMany();
  return res.status(200).json(hosts);
};

/* ============================================================
   GET HOST BY ID
============================================================ */
export const getHostById = async (req, res) => {
  const { id } = req.params;

  const host = await prisma.host.findUnique({ where: { id } });

  if (!host) {
    return res.status(404).send(); // WINC expects empty body
  }

  return res.status(200).json(host);
};

/* ============================================================
   CREATE HOST
============================================================ */
export const createHostController = async (req, res) => {
  const { username, password, name, email } = req.body;

  // WINC: empty body → 400 + empty body
  if (!username || !password || !name || !email) {
    return res.status(400).send();
  }

  await prisma.host.create({
    data: req.body,
  });

  // WINC: 201 + empty body
  return res.status(201).send();
};

/* ============================================================
   UPDATE HOST
============================================================ */
export const updateHost = async (req, res) => {
  const { id } = req.params;

  const host = await prisma.host.findUnique({ where: { id } });

  if (!host) {
    return res.status(404).send();
  }

  // WINC: invalid body → 400 + empty body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send();
  }

  await prisma.host.update({
    where: { id },
    data: req.body,
  });

  // WINC: 200 + empty body
  return res.status(200).send();
};

/* ============================================================
   DELETE HOST
============================================================ */
export const deleteHost = async (req, res) => {
  const { id } = req.params;

  const host = await prisma.host.findUnique({ where: { id } });

  if (!host) {
    return res.status(404).send();
  }

  await prisma.host.delete({ where: { id } });

  // WINC: 200 + empty body
  return res.status(200).send();
};
