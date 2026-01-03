import {
  ERROR_MESSAGES,
  LOG_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/messages.js";
import { documentRepository } from "../repositories/documentRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { logError } from "../utils/logger.js";

const clerkWebhookController = {
  async handleUserCreated(req, res) {
    try {
      const { data } = req.body;

      const clerkUserId = data.id;
      const email = data.email_addresses?.[0]?.email_address;
      const firstName = data.first_name || "";
      const lastName = data.last_name || "";

      if (!email) {
        return res.status(400).json({
          error: ERROR_MESSAGES.EMAIL_REQUIRED,
          message: ERROR_MESSAGES.WEBHOOK_EMAIL_NOT_FOUND_IN_PAYLOAD,
        });
      }

      const existingUser = await userRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(200).json({
          message: SUCCESS_MESSAGES.USER_EXISTS_DB,
          user: existingUser,
        });
      }

      // Creaza utilizatorul in baza de date (ID generat de DB)
      const userData = {
        first_name: firstName || "Unknown",
        last_name: lastName || "Unknown",
        email: email,
        password: "",
        number_of_attempts: 0,
      };

      const createdUser = await userRepository.createUser(userData);

      res.status(201).json({
        message: SUCCESS_MESSAGES.USER_SYNCED_DB,
        user: {
          id: createdUser.id,
          clerk_id: clerkUserId,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          email: createdUser.email,
        },
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({
          error: ERROR_MESSAGES.USER_ALREADY_EXISTS_EMAIL,
          message: ERROR_MESSAGES.USER_WITH_EMAIL_EXISTS,
        });
      }
      logError(LOG_MESSAGES.CLERK_WEBHOOK_USER_CREATED_ERROR, err, {
        clerkUserId,
        email,
      });
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.USER_SYNC_FAILED_DB,
      });
    }
  },

  async handleUserDeleted(req, res) {
    try {
      const { data } = req.body;

      const clerkUserId = data.id;

      if (!clerkUserId) {
        return res.status(400).json({
          error: ERROR_MESSAGES.USER_ID_REQUIRED,
          message: ERROR_MESSAGES.WEBHOOK_USER_ID_NOT_FOUND_IN_PAYLOAD,
        });
      }

      const email = data.email_addresses?.[0]?.email_address;
      const existingUser = email
        ? await userRepository.getUserByEmail(email)
        : null;
      if (!existingUser) {
        return res.status(200).json({
          message: SUCCESS_MESSAGES.USER_NOT_FOUND_NOTHING_TO_DELETE,
        });
      }

      // Șterge toate documentele asociate user-ului
      const userDocuments = await documentRepository.getDocumentsByUserId(
        existingUser.id
      );
      for (const doc of userDocuments) {
        try {
          await documentRepository.deleteDocument(doc.id);
        } catch (err) {
          logError(LOG_MESSAGES.CLERK_WEBHOOK_DELETE_DOCUMENT_ERROR, err, {
            documentId: doc.id,
            userId: existingUser.id,
          });
        }
      }

      // Șterge user-ul din baza de date
      await userRepository.deleteUser(existingUser.id);

      res.status(200).json({
        message: SUCCESS_MESSAGES.USER_DELETED_DB,
        deletedUserId: clerkUserId,
      });
    } catch (err) {
      logError(LOG_MESSAGES.CLERK_WEBHOOK_USER_DELETED_ERROR, err, {
        clerkUserId,
        email,
      });
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.USER_DELETE_FAILED_DB,
      });
    }
  },

  async handleWebhook(req, res) {
    try {
      const { type } = req.body;

      switch (type) {
        case "user.created":
          return await this.handleUserCreated(req, res);

        case "user.updated":
          return res
            .status(200)
            .json({ message: SUCCESS_MESSAGES.USER_UPDATE_WEBHOOK_RECEIVED });

        case "user.deleted":
          return await this.handleUserDeleted(req, res);

        default:
          return res
            .status(200)
            .json({ message: SUCCESS_MESSAGES.WEBHOOK_EVENT_UNHANDLED });
      }
    } catch (err) {
      logError(LOG_MESSAGES.CLERK_WEBHOOK_HANDLE_ERROR, err, { type: req.body?.type });
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.WEBHOOK_PROCESS_FAILED,
      });
    }
  },
};

export default clerkWebhookController;
