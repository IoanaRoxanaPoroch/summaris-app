import {
  DETAIL_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/messages.js";
import * as documentService from "../services/documentService.js";
import * as userService from "../services/userService.js";

const documentController = {
  async createView(req, res) {
    res.render("documentCreate", { error: null });
  },

  async getAll(req, res) {
    try {
      const documents = await documentService.getAllDocuments();
      res.json(documents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const document = await documentService.getDocumentById(req.params.id);
      res.json(document);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async getByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          error: ERROR_MESSAGES.EMAIL_REQUIRED,
          message: DETAIL_MESSAGES.EMAIL_REQUIRED_FOR_DOCUMENTS,
        });
      }

      const documents = await documentService.getDocumentsByUserEmail(email);
      res.json({ documents: documents || [] });
    } catch (err) {
      console.error("Get documents by email error:", err);
      if (err.message === "User not found" || err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS,
        });
      }
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.DOCUMENTS_FETCH_FAILED,
      });
    }
  },

  async getByUserId(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({
          error: ERROR_MESSAGES.USER_ID_REQUIRED,
          message: DETAIL_MESSAGES.USER_ID_REQUIRED_FOR_DOCUMENTS,
        });
      }

      const documents = await documentService.getDocumentsByUserId(userId);
      res.json({ documents: documents || [] });
    } catch (err) {
      console.error("Get documents by userId error:", err);
      if (err.message === "User not found" || err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_ID_NOT_EXISTS,
        });
      }
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.DOCUMENTS_FETCH_FAILED,
      });
    }
  },

  async update(req, res) {
    try {
      const { name, size, s3_url, user_id } = req.body;
      const documentId = req.params.id;

      if (!name || !size || !s3_url || !user_id) {
        return res.status(400).render("documentEdit", {
          error: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          document: { ...req.body, id: documentId },
        });
      }

      const updateData = {
        name,
        size: parseInt(size),
        s3_url,
        user_id,
      };

      const updatedDocument = await documentService.updateDocument(
        documentId,
        updateData
      );
      res.redirect(`/documents/${updatedDocument.id}`);
    } catch (err) {
      try {
        const document = await documentService.getDocumentById(req.params.id);
        res.status(400).render("documentEdit", {
          error: err.message,
          document: document || { ...req.body, id: req.params.id },
        });
      } catch {
        res.status(400).render("documentEdit", {
          error: err.message,
          document: { ...req.body, id: req.params.id },
        });
      }
    }
  },

  async deleteDoc(req, res) {
    try {
      const deletedDocument = await documentService.deleteDocument(
        req.params.id
      );
      res.json(deletedDocument);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getSummariesByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          error: ERROR_MESSAGES.EMAIL_REQUIRED,
          message: DETAIL_MESSAGES.EMAIL_REQUIRED_FOR_SUMMARIES,
        });
      }

      const documents = await documentService.getSummariesByUserEmail(email);
      const summaries = documentService.formatSummaries(documents);

      res.json({ summaries });
    } catch (err) {
      console.error("Get summaries error:", err);
      if (err.message === "User not found" || err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS,
        });
      }
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.SUMMARIES_FETCH_FAILED,
      });
    }
  },

  async getSummariesByUserId(req, res) {
    try {
      const { userId } = req.query;
      console.log("getSummariesByUserId - Received userId:", userId);

      if (!userId) {
        return res.status(400).json({
          error: ERROR_MESSAGES.USER_ID_REQUIRED,
          message: DETAIL_MESSAGES.USER_ID_REQUIRED_FOR_SUMMARIES,
        });
      }

      const documents = await documentService.getSummariesByUserId(userId);
      const summaries = documentService.formatSummaries(documents);

      res.json({ summaries });
    } catch (err) {
      console.error("Get summaries by userId error:", err);
      if (err.message === "User not found" || err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_ID_NOT_EXISTS,
        });
      }
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.SUMMARIES_FETCH_FAILED,
      });
    }
  },

  async upload(req, res) {
    try {
      console.log("req.body", req.body);
      const { email, name, size, s3_url } = req.body;

      if (!email || !name || !size) {
        return res.status(400).json({
          error: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          message: DETAIL_MESSAGES.REQUIRED_FIELDS_EMAIL_NAME_SIZE,
        });
      }

      const documentData = { name, size, s3_url };
      const result = await documentService.uploadDocument(email, documentData);

      res.status(201).json({
        message: SUCCESS_MESSAGES.DOCUMENT_UPLOADED,
        document: {
          id: result.document.id,
          name: result.document.name,
          size: result.document.size,
          created_at: result.document.created_at,
        },
        remainingAttempts: result.remainingAttempts,
      });
    } catch (err) {
      console.error("Upload error:", err);
      if (err.message === "User not found" || err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS,
        });
      }
      if (err.message.includes("limita de 3 încercări")) {
        return res.status(403).json({
          error: "Limită atinsă",
          message: err.message,
          limitReached: true,
        });
      }
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.DOCUMENT_UPLOAD_FAILED,
      });
    }
  },

  async summarize(req, res) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: ERROR_MESSAGES.EMAIL_REQUIRED,
          message: DETAIL_MESSAGES.EMAIL_REQUIRED_FOR_OWNERSHIP_CHECK,
        });
      }

      const user = await userService.getUserByEmail(email);
      await documentService.verifyDocumentOwnership(id, user.id);

      const mockSummary = {
        id: `summary-${Date.now()}`,
        content:
          "Acesta este un rezumat mock. Logica de generare rezumat va fi implementată ulterior.",
        size: 100,
        created_at: new Date(),
      };

      res.json({
        message: SUCCESS_MESSAGES.SUMMARY_GENERATED,
        summary: mockSummary,
      });
    } catch (err) {
      console.error("Summarize error:", err);
      if (err.message === "User not found" || err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: DETAIL_MESSAGES.USER_WITH_EMAIL_NOT_EXISTS,
        });
      }
      if (err.message === "Document not found" || err.message === ERROR_MESSAGES.DOCUMENT_NOT_FOUND) {
        return res.status(404).json({
          error: ERROR_MESSAGES.DOCUMENT_NOT_FOUND,
          message: DETAIL_MESSAGES.DOCUMENT_WITH_ID_NOT_EXISTS,
        });
      }
      if (err.message.includes("permission")) {
        return res.status(403).json({
          error: ERROR_MESSAGES.UNAUTHORIZED,
          message: ERROR_MESSAGES.DOCUMENT_PERMISSION_DENIED,
        });
      }
      res.status(500).json({
        error: err.message,
        message: ERROR_MESSAGES.SUMMARY_GENERATION_FAILED,
      });
    }
  },
};

export default documentController;
