import { documentsRepository } from "../repositories/documentRepository.js";

const documentControllerMVC = {
  async createView(req, res) {
    res.render("documentCreate", { error: null });
  },

  async create(req, res) {
    try {
      const { name, size, s3_url, user_id } = req.body;

      if (!name || !size || !s3_url || !user_id) {
        return res.status(400).render("documentCreate", {
          error: "All fields are required",
          document: req.body,
        });
      }

      const documentData = {
        name,
        size: parseInt(size),
        s3_url,
        user_id,
      };

      const createdDocument = await documentsRepository.createDocument(
        documentData
      );
      res.redirect(`/documents/${createdDocument.id}`);
    } catch (err) {
      res.status(400).render("documentCreate", {
        error: err.message,
        document: req.body,
      });
    }
  },

  async getAllView(req, res) {
    try {
      const documents = await documentsRepository.getAllDocuments();
      res.render("documentsIndex", {
        title: "Documents",
        documents: documents,
      });
    } catch (err) {
      res.status(500).render("documentsIndex", {
        title: "Documents",
        documents: [],
        error: err.message,
      });
    }
  },

  async getByIdView(req, res) {
    try {
      if (
        req.params.id === "create" ||
        req.params.id === "api" ||
        req.params.id === "edit"
      ) {
        return res.status(404).render("documentDetails", {
          document: null,
          error: "Invalid document ID",
        });
      }

      const document = await documentsRepository.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).render("documentDetails", {
          document: null,
          error: "Document not found",
        });
      }
      res.render("documentDetails", { document: document });
    } catch (err) {
      res.status(404).render("documentDetails", {
        document: null,
        error: err.message,
      });
    }
  },

  async editView(req, res) {
    try {
      const document = await documentsRepository.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).render("documentEdit", {
          document: null,
          error: "Document not found",
        });
      }
      res.render("documentEdit", { document: document, error: null });
    } catch (err) {
      res.status(404).render("documentEdit", {
        document: null,
        error: err.message,
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
};

export default documentControllerMVC;
