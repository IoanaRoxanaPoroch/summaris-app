import { ERROR_MESSAGES } from "../constants/messages.js";
import { userRepository } from "../repositories/userRepository.js";

export const createUser = async (data) => {
  if (!data.email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  const existingUser = await userRepository.getUserByEmail(data.email);
  if (existingUser) {
    throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  return userRepository.createUser(data);
};

export const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

export const getUserById = async (id) => {
  if (!id) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

export const getAllUsers = async () => {
  return userRepository.getAllUsers();
};

export const updateUser = async (id, data) => {
  if (!id) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return userRepository.updateUser(id, data);
};

export const deleteUser = async (id) => {
  if (!id) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return userRepository.deleteUser(id);
};

export const incrementAttempts = async (id) => {
  if (!id) {
    throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return userRepository.incrementAttempts(id);
};
