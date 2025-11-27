import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const usersRepository = {
  async createUser(data) {
    return prisma.user.create({ data });
  },

  async getAllUsers() {
    return prisma.user.findMany();
  },

  async getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  async getUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  },
};
