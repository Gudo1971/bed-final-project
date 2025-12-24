import prisma from "../lib/prisma.js";

export async function getAllHosts() {
  return prisma.host.findMany({
    include: {
      user: true,
    },
  });
}

export async function getHostById(id) {
  return prisma.host.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
    },
  });
}

export async function createHost(data) {
  return prisma.host.create({
    data: {
      name: data.name,
      userId: Number(data.userId),
    },
    include: {
      user: true,
    },
  });
}

export async function updateHost(id, data) {
  return prisma.host.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      userId: data.userId ? Number(data.userId) : undefined,
    },
    include: {
      user: true,
    },
  });
}

export async function deleteHost(id) {
  return prisma.host.delete({
    where: { id: Number(id) },
  });
}
