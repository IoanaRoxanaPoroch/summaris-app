import { subscriptionRepository } from "../repositories/subscriptionRepository.js";
import { userRepository } from "../repositories/userRepository.js";

const PLAN_CONFIG = {
  free: { name: "Gratuit", price: 0, status: "active" },
  pro: { name: "Pro", price: 100, status: "active" },
  premium: { name: "Premium", price: 400, status: "active" },
};

export const getSubscriptionByUserId = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const subscription = await subscriptionRepository.getSubscriptionByUserId(
    userId
  );

  return (
    subscription || {
      name: PLAN_CONFIG.free.name,
      price: PLAN_CONFIG.free.price,
      status: PLAN_CONFIG.free.status,
    }
  );
};

export const getSubscriptionByUserEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const subscription = await subscriptionRepository.getSubscriptionByUserId(
    user.id
  );

  return (
    subscription || {
      name: PLAN_CONFIG.free.name,
      price: PLAN_CONFIG.free.price,
      status: PLAN_CONFIG.free.status,
    }
  );
};

export const selectPlan = async (email, plan) => {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!plan) {
    throw new Error("Plan is required");
  }

  const planCfg = PLAN_CONFIG[plan];
  if (!planCfg) {
    throw new Error("Planul selectat nu există");
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("User cu acest email nu există");
  }

  const subscriptionData = {
    name: planCfg.name,
    price: planCfg.price,
    stripe_subscription_id: "",
    status: planCfg.status,
  };

  return subscriptionRepository.upsertSubscription(user.id, subscriptionData);
};

export const upsertSubscription = async (userId, data) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return subscriptionRepository.upsertSubscription(userId, data);
};
