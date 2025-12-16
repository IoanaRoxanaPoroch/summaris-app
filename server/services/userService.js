import { userRepository } from "../repositories/userRepository.js";

export const createUser = async (data) => {
  if (!data.email) {
    throw new Error("Email is required");
  }

  const existingUser = await userRepository.getUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  return userRepository.createUser(data);
};

export const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getUserById = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllUsers = async () => {
  return userRepository.getAllUsers();
};

export const updateUser = async (id, data) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return userRepository.updateUser(id, data);
};

export const deleteUser = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return userRepository.deleteUser(id);
};

export const incrementAttempts = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return userRepository.incrementAttempts(id);
};
