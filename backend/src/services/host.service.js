import prisma from "../lib/prisma.js";

/* ============================================================
   GET ALL HOSTS
============================================================ */
export async function getAllHosts() {
  return prisma.host.findMany();
}

/* ============================================================
   GET HOST BY EMAIL
============================================================ */
export async function getHostByEmail(email) {
  return prisma.host.findUnique({
    where: { email },
  });
}

/* ============================================================
   CREATE HOST (used by /api/account/become-host)
============================================================ */
export async function createHostFromUser(user) {
  return prisma.host.create({
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
}

/* ============================================================
   DELETE HOST (used by /api/account/stop-host)
============================================================ */
export async function deleteHostByEmail(email) {
  return prisma.host.delete({
    where: { email },
  });
}
