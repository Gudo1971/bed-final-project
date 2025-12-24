// src/services/user.service.js
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";


export const getAllUsers = async () => {
  // Simpel houden: geen includes nodig voor de tests
  return prisma.user.findMany();
};

export const getUserById = async (id) => {
  // id is een UUID string
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (data) => {
  // Verwacht: { email, password, username }
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      username: data.username,
    },
  });
};


export const updateUser = async (id, data) => {
  const updateData = {};

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.username !== undefined) {
    updateData.username = data.username;
  }

  if (data.password !== undefined) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};
