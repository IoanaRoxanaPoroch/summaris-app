import * as subscriptionService from "../services/subscriptionService.js";

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

      const subscription = await subscriptionService.getSubscriptionByUserEmail(
        email
      );

      return res.status(200).json({
        subscription,
      });
    } catch (err) {
      console.error("Get subscription error:", err);
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User cu acest email nu există",
        });
      }
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

      const subscription = await subscriptionService.selectPlan(email, plan);

      return res.status(200).json({
        message: "Plan selectat cu succes",
        subscription,
      });
    } catch (err) {
      console.error("Select plan error:", err);
      if (err.message === "User cu acest email nu există" || err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User cu acest email nu există",
        });
      }
      if (err.message === "Planul selectat nu există") {
        return res.status(400).json({
          error: "Invalid plan",
          message: "Planul selectat nu există",
        });
      }
      return res.status(500).json({
        error: err.message,
        message: "Nu s-a putut salva planul",
      });
    }
  },
};

export default subscriptionController;

