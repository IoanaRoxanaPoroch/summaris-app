import {
  DETAIL_MESSAGES,
  ERROR_MESSAGES,
  LOG_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/messages.js";
import * as subscriptionService from "../services/subscriptionService.js";
import { logError } from "../utils/logger.js";

const subscriptionController = {
  async getByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          error: ERROR_MESSAGES.EMAIL_REQUIRED,
          message: DETAIL_MESSAGES.EMAIL_PLEASE_PROVIDE,
        });
      }

      const subscription = await subscriptionService.getSubscriptionByUserEmail(
        email
      );

      return res.status(200).json({
        subscription,
      });
    } catch (err) {
      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS,
        });
      }
      logError(LOG_MESSAGES.GET_SUBSCRIPTION_ERROR, err, { email });
      return res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.SUBSCRIPTION_FETCH_FAILED,
      });
    }
  },

  async selectPlan(req, res) {
    try {
      const { email, plan } = req.body;

      if (!email || !plan) {
        return res.status(400).json({
          error: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          message: DETAIL_MESSAGES.REQUIRED_FIELDS_EMAIL_PLAN,
        });
      }

      const subscription = await subscriptionService.selectPlan(email, plan);

      return res.status(200).json({
        message: SUCCESS_MESSAGES.PLAN_SELECTED,
        subscription,
      });
    } catch (err) {
      if (
        err.message === ERROR_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS ||
        err.message === ERROR_MESSAGES.USER_NOT_FOUND
      ) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS,
        });
      }
      if (err.message === ERROR_MESSAGES.PLAN_NOT_FOUND) {
        return res.status(400).json({
          error: ERROR_MESSAGES.INVALID_PLAN_EN,
          message: ERROR_MESSAGES.PLAN_NOT_FOUND,
        });
      }
      logError(LOG_MESSAGES.SELECT_PLAN_ERROR, err, { email, plan });
      return res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.SUBSCRIPTION_SAVE_FAILED,
      });
    }
  },
};

export default subscriptionController;
