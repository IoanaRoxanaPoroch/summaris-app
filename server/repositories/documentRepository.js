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
        summary: true,
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

  async getDocumentsWithSummaryByUserId(userId) {
    return prisma.document.findMany({
      where: {
        user_id: userId,
        summary: {
          isNot: null,
        },
      },
      include: {
        summary: true,
      },
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

  async countDocumentsTodayByUserId(userId) {
    // Use UTC to avoid timezone issues
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    return prisma.document.count({
      where: {
        user_id: userId,
        created_at: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  },

  async countSummariesByUserId(userId) {
    return prisma.summary.count({
      where: {
        document: {
          user_id: userId,
        },
      },
    });
  },

  async countSummariesTodayByUserId(userId) {
    // Use UTC to avoid timezone issues
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    return prisma.summary.count({
      where: {
        document: {
          user_id: userId,
        },
        created_at: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  },

  async createSummary(data) {
    return prisma.summary.create({ data });
  },
};
