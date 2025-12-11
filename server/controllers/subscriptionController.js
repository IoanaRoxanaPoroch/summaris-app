import { subscriptionRepository } from "../repositories/subscriptionRepository.js";
import { usersRepository } from "../repositories/userRepository.js";

const PLAN_CONFIG = {
  free: { name: "Gratuit", price: 0, status: "active" },
  pro: { name: "Pro", price: 100, status: "active" },
  premium: { name: "Premium", price: 400, status: "active" },
};

const subscriptionController = {
  async getByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          error: "Missing email",
          message: "Email este necesar",
        });
      }

      const user = await usersRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User cu acest email nu există",
        });
      }

      const subscription = await subscriptionRepository.getSubscriptionByUserId(
        user.id
      );

      return res.status(200).json({
        subscription:
          subscription || {
            name: PLAN_CONFIG.free.name,
            price: PLAN_CONFIG.free.price,
            status: PLAN_CONFIG.free.status,
          },
      });
    } catch (err) {
      console.error("Get subscription error:", err);
      return res.status(500).json({
        error: err.message,
        message: "Nu s-a putut obține planul",
      });
    }
  },

  async selectPlan(req, res) {
    try {
      const { email, plan } = req.body;

      if (!email || !plan) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Email și plan sunt necesare",
        });
      }

      const planCfg = PLAN_CONFIG[plan];
      if (!planCfg) {
        return res.status(400).json({
          error: "Invalid plan",
          message: "Planul selectat nu există",
        });
      }

      const user = await usersRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User cu acest email nu există",
        });
      }

      const subscriptionData = {
        name: planCfg.name,
        price: planCfg.price,
        stripe_subscription_id: "", // placeholder
        status: planCfg.status,
      };

      const subscription = await subscriptionRepository.upsertSubscription(
        user.id,
        subscriptionData
      );

      return res.status(200).json({
        message: "Plan selectat cu succes",
        subscription,
      });
    } catch (err) {
      console.error("Select plan error:", err);
      return res.status(500).json({
        error: err.message,
        message: "Nu s-a putut salva planul",
      });
    }
  },
};

export default subscriptionController;

