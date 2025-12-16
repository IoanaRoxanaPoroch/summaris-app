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
          error: "Email required",
          message: "Email is required to fetch documents",
        });
      }

      const documents = await documentService.getDocumentsByUserEmail(email);
      res.json({ documents: documents || [] });
    } catch (err) {
      console.error("Get documents by email error:", err);
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to fetch documents",
      });
    }
  },

  async getByUserId(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({
          error: "UserId required",
          message: "UserId is required to fetch documents",
        });
      }

      const documents = await documentService.getDocumentsByUserId(userId);
      res.json({ documents: documents || [] });
    } catch (err) {
      console.error("Get documents by userId error:", err);
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User with this id does not exist",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to fetch documents",
      });
    }
  },

  async update(req, res) {
    try {
      const { name, size, s3_url, user_id } = req.body;
      const documentId = req.params.id;

      if (!name || !size || !s3_url || !user_id) {
        return res.status(400).render("documentEdit", {
          error: "All fields are required",
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
          error: "Email required",
          message: "Email is required to fetch summaries",
        });
      }

      const documents = await documentService.getSummariesByUserEmail(email);
      const summaries = documentService.formatSummaries(documents);

      res.json({ summaries });
    } catch (err) {
      console.error("Get summaries error:", err);
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to fetch summaries",
      });
    }
  },

  async getSummariesByUserId(req, res) {
    try {
      const { userId } = req.query;
      console.log("getSummariesByUserId - Received userId:", userId);

      if (!userId) {
        return res.status(400).json({
          error: "UserId required",
          message: "UserId is required to fetch summaries",
        });
      }

      const documents = await documentService.getSummariesByUserId(userId);
      const summaries = documentService.formatSummaries(documents);

      res.json({ summaries });
    } catch (err) {
      console.error("Get summaries by userId error:", err);
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User with this id does not exist",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to fetch summaries",
      });
    }
  },

  async upload(req, res) {
    try {
      console.log("req.body", req.body);
      const { email, name, size, s3_url } = req.body;

      if (!email || !name || !size) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Email, name, and size are required",
        });
      }

      const documentData = { name, size, s3_url };
      const result = await documentService.uploadDocument(email, documentData);

      res.status(201).json({
        message: "Document uploaded successfully",
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
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }
      if (err.message.includes("limita de 3 încercări")) {
        return res.status(403).json({
          error: "Limit reached",
          message: err.message,
          limitReached: true,
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to upload document",
      });
    }
  },

  async summarize(req, res) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Email required",
          message: "Email is required to verify document ownership",
        });
      }

      const user = await userService.getUserByEmail(email);
      await documentService.verifyDocumentOwnership(id, user.id);

      // TODO: Aici va fi logica de generare rezumat (AI/ML service)
      // Pentru moment, returnăm un rezumat mock
      const mockSummary = {
        id: `summary-${Date.now()}`,
        content:
          "Acesta este un rezumat mock. Logica de generare rezumat va fi implementată ulterior.",
        size: 100,
        created_at: new Date(),
      };

      res.json({
        message: "Summary generated successfully",
        summary: mockSummary,
      });
    } catch (err) {
      console.error("Summarize error:", err);
      if (err.message === "User not found") {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }
      if (err.message === "Document not found") {
        return res.status(404).json({
          error: "Document not found",
          message: "Document with this ID does not exist",
        });
      }
      if (err.message.includes("permission")) {
        return res.status(403).json({
          error: "Unauthorized",
          message: "You don't have permission to access this document",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to generate summary",
      });
    }
  },
};

export default documentController;
