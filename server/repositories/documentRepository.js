import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const documentRepository = {
  async createDocument(data) {
    return prisma.document.create({ data });
  },

  async getAllDocuments() {
    return prisma.document.findMany({
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
  },

  async getDocumentById(id) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
  },

  async updateDocument(id, data) {
    return prisma.document.update({
      where: { id },
      data,
    });
  },

  async deleteDocument(id) {
    return prisma.document.delete({ where: { id } });
  },

  async getDocumentsByUserId(userId) {
    return prisma.document.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  },

  async countDocumentsByUserId(userId) {
    return prisma.document.count({
      where: { user_id: userId },
    });
  },

  async getSummariesByUserId(userId) {
    return prisma.document.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        summary: true,
      },
    });
  },
};
