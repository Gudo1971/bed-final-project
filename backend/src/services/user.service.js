// src/services/user.service.js
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

/* ============================================================
   GET ALL USERS
============================================================ */
export const getAllUsers = async () => {
  return prisma.user.findMany();
};

/* ============================================================
   GET USER BY ID
============================================================ */
export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

/* ============================================================
   CREATE USER
============================================================ */
export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: hashedPassword,
      name: data.name ?? null,
      phoneNumber: data.phoneNumber ?? null,
      pictureUrl: data.pictureUrl ?? null,
      aboutMe: data.aboutMe ?? null,
    },
  });
};

/* ============================================================
   UPDATE USER
============================================================ */
export const updateUser = async (id, data) => {
  const updateData = {};

  if (data.email !== undefined) updateData.email = data.email;
  if (data.username !== undefined) updateData.username = data.username;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
  if (data.pictureUrl !== undefined) updateData.pictureUrl = data.pictureUrl;
  if (data.aboutMe !== undefined) updateData.aboutMe = data.aboutMe;

  if (data.password !== undefined) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

/* ============================================================
   DELETE USER
============================================================ */
export const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};
