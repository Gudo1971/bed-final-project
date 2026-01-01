// ==============================================
// = USER CONTROLLER — WINC TEST VERSION        =
// ==============================================

import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

/* ============================================================
   GET ALL USERS
============================================================ */
export const getAllUsersController = async (req, res) => {
  const users = await prisma.user.findMany();
  return res.status(200).json(users);
};

/* ============================================================
   GET USER BY ID
============================================================ */
export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).send(); // WINC expects empty body
  }

  return res.status(200).json(user);
};

/* ============================================================
   CREATE USER
============================================================ */
export const createUserController = async (req, res) => {
  const { email, password, username } = req.body;

  // WINC: empty or invalid body → 400 + empty body
  if (!email || !password || !username) {
    return res.status(400).send();
  }

  await prisma.user.create({
    data: {
      email,
      password,
      username,
    },
  });

  // WINC: 201 + empty body
  return res.status(201).send();
};

/* ============================================================
   UPDATE USER
============================================================ */
export const updateUserController = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.user.findUnique({ where: { id } });

  if (!existing) {
    return res.status(404).send();
  }

  // WINC: invalid body → 400 + empty body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send();
  }

  await prisma.user.update({
    where: { id },
    data: req.body,
  });

  // WINC: 200 + empty body
  return res.status(200).send();
};

/* ============================================================
   DELETE USER
============================================================ */
export const deleteUserController = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).send();
  }

  await prisma.user.delete({ where: { id } });

  // WINC: 200 + empty body
  return res.status(200).send();
};
