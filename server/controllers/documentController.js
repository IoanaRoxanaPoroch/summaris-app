import { documentsRepository } from "../repositories/documentRepository.js";
import { usersRepository } from "../repositories/userRepository.js";

const documentController = {
  async createView(req, res) {
    res.render("documentCreate", { error: null });
  },

  async getAll(req, res) {
    try {
      const documents = await documentsRepository.getAllDocuments();
      res.json(documents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const document = await documentsRepository.getDocumentById(req.params.id);
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

      const user = await usersRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }

      const documents = await documentsRepository.getDocumentsByUserId(user.id);
      res.json({ documents: documents || [] });
    } catch (err) {
      console.error("Get documents by email error:", err);
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

      const user = await usersRepository.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User with this id does not exist",
        });
      }

      const documents = await documentsRepository.getDocumentsByUserId(user.id);
      res.json({ documents: documents || [] });
    } catch (err) {
      console.error("Get documents by email error:", err);
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

      const updatedDocument = await documentsRepository.updateDocument(
        documentId,
        updateData
      );
      res.redirect(`/documents/${updatedDocument.id}`);
    } catch (err) {
      const document = await documentsRepository
        .getDocumentById(req.params.id)
        .catch(() => null);
      res.status(400).render("documentEdit", {
        error: err.message,
        document: document || { ...req.body, id: req.params.id },
      });
    }
  },

  async deleteDoc(req, res) {
    try {
      const deletedDocument = await documentsRepository.deleteDocument(
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

      const user = await usersRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }

      const documents = await documentsRepository.getSummariesByUserId(user.id);

      const summaries = documents
        .filter((doc) => doc.summary)
        .map((doc) => ({
          documentId: doc.id,
          documentName: doc.name,
          documentSize: doc.size,
          documentCreatedAt: doc.created_at,
          summaryId: doc.summary.id,
          content: doc.summary.content,
          size: doc.summary.size,
          created_at: doc.summary.created_at,
        }));

      res.json({ summaries });
    } catch (err) {
      console.error("Get summaries error:", err);
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

      const user = await usersRepository.getUserById(userId);
      console.log(
        "getSummariesByUserId - User found:",
        user ? user.id : "null"
      );

      if (!user) {
        console.log(
          "getSummariesByUserId - User not found for userId:",
          userId
        );
        return res.status(404).json({
          error: "User not found",
          message: "User with this id does not exist",
        });
      }

      const documents = await documentsRepository.getSummariesByUserId(user.id);

      const summaries = documents
        .filter((doc) => doc.summary)
        .map((doc) => ({
          documentId: doc.id,
          documentName: doc.name,
          documentSize: doc.size,
          documentCreatedAt: doc.created_at,
          summaryId: doc.summary.id,
          content: doc.summary.content,
          size: doc.summary.size,
          created_at: doc.summary.created_at,
        }));

      res.json({ summaries });
    } catch (err) {
      console.error("Get summaries by userId error:", err);
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

      // Găsește user-ul după email
      const user = await usersRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }

      // Verifică limita de încercări (3 încercări gratuite)
      if (user.number_of_attempts >= 3) {
        return res.status(403).json({
          error: "Limit reached",
          message:
            "Ai atins limita de 3 încercări gratuite. Te rugăm să te abonezi pentru a continua.",
          limitReached: true,
        });
      }

      // Creează documentul
      const documentData = {
        name,
        size: parseInt(size),
        s3_url: s3_url || "",
        user_id: user.id,
      };

      const createdDocument = await documentsRepository.createDocument(
        documentData
      );

      // Incrementează numărul de încercări
      await usersRepository.incrementAttempts(user.id);

      res.status(201).json({
        message: "Document uploaded successfully",
        document: {
          id: createdDocument.id,
          name: createdDocument.name,
          size: createdDocument.size,
          created_at: createdDocument.created_at,
        },
        remainingAttempts: 3 - (user.number_of_attempts + 1),
      });
    } catch (err) {
      console.error("Upload error:", err);
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

      // Găsește user-ul după email
      const user = await usersRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User with this email does not exist",
        });
      }

      // Găsește documentul
      const document = await documentsRepository.getDocumentById(id);
      if (!document) {
        return res.status(404).json({
          error: "Document not found",
          message: "Document with this ID does not exist",
        });
      }

      // Verifică dacă documentul aparține user-ului
      if (document.user_id !== user.id) {
        return res.status(403).json({
          error: "Unauthorized",
          message: "You don't have permission to access this document",
        });
      }

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
      res.status(500).json({
        error: err.message,
        message: "Failed to generate summary",
      });
    }
  },
};

export default documentController;
