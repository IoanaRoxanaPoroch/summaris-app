import { ERROR_MESSAGES } from "../constants/messages.js";
import { subscriptionRepository } from "../repositories/subscriptionRepository.js";
import { userRepository } from "../repositories/userRepository.js";

const PLAN_CONFIG = {
  free: { name: "Gratuit", price: 0, status: "active" },
  pro: { name: "Pro", price: 100, status: "active" },
  premium: { name: "Premium", price: 400, status: "active" },
};

export const getSubscriptionByUserId = async (userId) => {
  if (!userId) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
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
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
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
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  if (!plan) {
    throw new Error(ERROR_MESSAGES.PLAN_REQUIRED);
  }

  const planCfg = PLAN_CONFIG[plan];
  if (!planCfg) {
    throw new Error(ERROR_MESSAGES.PLAN_NOT_FOUND);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
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
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return subscriptionRepository.upsertSubscription(userId, data);
};
