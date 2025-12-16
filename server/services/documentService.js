import { documentRepository } from "../repositories/documentRepository.js";
import { userRepository } from "../repositories/userRepository.js";

export const getAllDocuments = async () => {
  return documentRepository.getAllDocuments();
};

export const createDocument = async (data) => {
  if (!data.name) {
    throw new Error("Name is required");
  }

  if (!data.size) {
    throw new Error("Size is required");
  }

  if (!data.user_id) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(data.user_id);
  if (!user) {
    throw new Error("User not found");
  }

  return documentRepository.createDocument(data);
};

export const getDocumentById = async (id) => {
  if (!id) {
    throw new Error("Document ID is required");
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    throw new Error("Document not found");
  }

  return document;
};

export const getDocumentsByUserId = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return documentRepository.getDocumentsByUserId(userId);
};

export const getDocumentsByUserEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  return documentRepository.getDocumentsByUserId(user.id);
};

export const updateDocument = async (id, data) => {
  if (!id) {
    throw new Error("Document ID is required");
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    throw new Error("Document not found");
  }

  return documentRepository.updateDocument(id, data);
};

export const deleteDocument = async (id) => {
  if (!id) {
    throw new Error("Document ID is required");
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    throw new Error("Document not found");
  }

  return documentRepository.deleteDocument(id);
};

export const uploadDocument = async (email, documentData) => {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!documentData.name || !documentData.size) {
    throw new Error("Name and size are required");
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.number_of_attempts >= 3) {
    throw new Error(
      "Ai atins limita de 3 încercări gratuite. Te rugăm să te abonezi pentru a continua."
    );
  }

  const data = {
    name: documentData.name,
    size: parseInt(documentData.size),
    s3_url: documentData.s3_url || "",
    user_id: user.id,
  };

  const createdDocument = await documentRepository.createDocument(data);
  await userRepository.incrementAttempts(user.id);

  return {
    document: createdDocument,
    remainingAttempts: 3 - (user.number_of_attempts + 1),
  };
};

export const getSummariesByUserId = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return documentRepository.getSummariesByUserId(userId);
};

export const getSummariesByUserEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  return documentRepository.getSummariesByUserId(user.id);
};

export const verifyDocumentOwnership = async (documentId, userId) => {
  if (!documentId) {
    throw new Error("Document ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const document = await documentRepository.getDocumentById(documentId);
  if (!document) {
    throw new Error("Document not found");
  }

  if (document.user_id !== userId) {
    throw new Error("You don't have permission to access this document");
  }

  return document;
};

export const formatSummaries = (documents) => {
  return documents
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
};
