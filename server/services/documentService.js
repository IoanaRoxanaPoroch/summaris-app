import { ERROR_MESSAGES } from "../constants/messages.js";
import { documentRepository } from "../repositories/documentRepository.js";
import { subscriptionRepository } from "../repositories/subscriptionRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { deleteCache, getCache, setCache } from "./cacheService.js";

const CACHE_EXPIRATION = 60 * 60 * 24 * 7; // 1 week

export const getAllDocuments = async () => {
  const cacheKey = "documents:all";

  const cachedDocuments = await getCache(cacheKey);
  if (cachedDocuments) {
    return {
      data: cachedDocuments,
      source: "cache",
      cached: true,
    };
  }

  const documents = await documentRepository.getAllDocuments();

  await setCache(cacheKey, documents, CACHE_EXPIRATION);

  return {
    data: documents,
    source: "database",
    cached: false,
  };
};

export const createDocument = async (data) => {
  if (!data.name) {
    throw new Error(ERROR_MESSAGES.NAME_REQUIRED);
  }

  if (!data.size) {
    throw new Error(ERROR_MESSAGES.SIZE_REQUIRED);
  }

  if (!data.user_id) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(data.user_id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const createdDocument = await documentRepository.createDocument(data);

  await deleteCache("documents:all");

  return createdDocument;
};

export const getDocumentById = async (id) => {
  const cacheKey = `document:${id}`;
  const cachedDocument = await getCache(cacheKey);

  if (!id) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
  }
  if (cachedDocument) {
    return cachedDocument;
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
  }

  await setCache(cacheKey, document, CACHE_EXPIRATION);

  return document;
};

export const getDocumentsByUserId = async (userId) => {
  if (!userId) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return documentRepository.getDocumentsByUserId(userId);
};

export const getDocumentsByUserEmail = async (email) => {
  if (!email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const subscription = await subscriptionRepository.getSubscriptionByUserId(
    user.id
  );
  const planName = subscription?.name?.trim() || "Gratuit";

  if (planName === "Gratuit") {
    return documentRepository.getDocumentsWithSummaryByUserId(user.id);
  }

  return documentRepository.getDocumentsByUserId(user.id);
};

export const updateDocument = async (id, data) => {
  if (!id) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
  }

  const updatedDocument = await documentRepository.updateDocument(id, data);

  await deleteCache("documents:all");
  await deleteCache(`document:${id}`);

  return updatedDocument;
};

export const deleteDocument = async (id) => {
  if (!id) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
  }

  const deletedDocument = await documentRepository.deleteDocument(id);

  await deleteCache("documents:all");
  await deleteCache(`document:${id}`);

  return deletedDocument;
};

export const uploadDocument = async (email, documentData) => {
  if (!email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  if (!documentData.name || !documentData.size) {
    throw new Error(ERROR_MESSAGES.NAME_AND_SIZE_REQUIRED);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const data = {
    name: documentData.name,
    size: parseInt(documentData.size),
    s3_url: documentData.s3_url || "",
    user_id: user.id,
  };

  const createdDocument = await documentRepository.createDocument(data);

  return {
    document: createdDocument,
  };
};

export const getSummariesByUserId = async (userId) => {
  if (!userId) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return documentRepository.getSummariesByUserId(userId);
};

export const getSummariesByUserEmail = async (email) => {
  if (!email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return documentRepository.getSummariesByUserId(user.id);
};

export const verifyDocumentOwnership = async (documentId, userId) => {
  if (!documentId) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
  }

  if (!userId) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const document = await documentRepository.getDocumentById(documentId);
  if (!document) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
  }

  if (document.user_id !== userId) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_PERMISSION_DENIED);
  }

  return document;
};

export const generateSummary = async (documentId, email, summaryContent) => {
  if (!email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  if (!documentId) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const document = await verifyDocumentOwnership(documentId, user.id);

  const subscription = await subscriptionRepository.getSubscriptionByUserId(
    user.id
  );
  const planName = subscription?.name?.trim() || "Gratuit";

  if (document.summary) {
    let remainingAttempts;
    if (planName === "Gratuit") {
      const totalSummaries = await documentRepository.countSummariesByUserId(
        user.id
      );
      remainingAttempts = 3 - totalSummaries;
    } else if (planName === "Pro") {
      const summariesToday =
        await documentRepository.countSummariesTodayByUserId(user.id);
      remainingAttempts = 5 - summariesToday;
    } else {
      remainingAttempts = -1;
    }

    return {
      summary: document.summary,
      remainingAttempts,
    };
  }

  if (planName === "Gratuit") {
    const totalSummaries = await documentRepository.countSummariesByUserId(
      user.id
    );

    if (totalSummaries >= 3) {
      throw new Error(ERROR_MESSAGES.FREE_ATTEMPTS_LIMIT_REACHED);
    }
  } else if (planName === "Pro") {
    const summariesToday = await documentRepository.countSummariesTodayByUserId(
      user.id
    );
    if (summariesToday > 5) {
      throw new Error(ERROR_MESSAGES.PRO_DAILY_LIMIT_REACHED);
    }
  }

  const summaryData = {
    content: summaryContent || "Acesta este un rezumat mock.",
    size: (summaryContent || "").length || 100,
    doc_id: documentId,
  };

  const createdSummary = await documentRepository.createSummary(summaryData);

  let remainingAttempts;
  if (planName === "Gratuit") {
    const totalSummariesAfter = await documentRepository.countSummariesByUserId(
      user.id
    );
    remainingAttempts = 3 - totalSummariesAfter;
  } else if (planName === "Pro") {
    const summariesTodayAfter =
      await documentRepository.countSummariesTodayByUserId(user.id);
    remainingAttempts = 5 - summariesTodayAfter;
  } else {
    remainingAttempts = -1;
  }

  return {
    summary: createdSummary,
    remainingAttempts,
  };
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
