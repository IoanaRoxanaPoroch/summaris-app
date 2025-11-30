import { documentsRepository } from "../repositories/documentRepository.js";

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
};

export default documentController;





