import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscriptionRepository = {
  async upsertSubscription(userId, data) {
    return prisma.subscription.upsert({
      where: { user_id: userId },
      update: data,
      create: {
        ...data,
        user_id: userId,
      },
    });
  },

  async getSubscriptionByUserId(userId) {
    return prisma.subscription.findUnique({
      where: { user_id: userId },
    });
  },
};

