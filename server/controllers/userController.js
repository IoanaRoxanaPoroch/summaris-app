import { usersRepository } from "../repositories/userRepository.js";

const userController = {
  async createView(req, res) {
    res.render("userCreate", { error: null });
  },

  async create(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).render("userCreate", {
          error: "All fields are required",
          user: req.body,
        });
      }

      const userData = {
        first_name,
        last_name,
        email,
        password,
        number_of_attempts: 0,
      };

      const createdUser = await usersRepository.createUser(userData);
      res.redirect(`/users/${createdUser.id}`);
    } catch (err) {
      res.status(400).render("userCreate", {
        error: err.message,
        user: req.body,
      });
    }
  },

  async createAPI(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          error: "All fields are required",
          message: "First name, last name, email, and password are required",
        });
      }

      const userData = {
        first_name,
        last_name,
        email,
        password,
        number_of_attempts: 0,
      };

      const createdUser = await usersRepository.createUser(userData);
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: createdUser.id,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          email: createdUser.email,
          created_at: createdUser.created_at,
        },
      });
    } catch (err) {
      if (err.code === "P2002") {
        // Prisma unique constraint error
        return res.status(409).json({
          error: "Email already exists",
          message: "A user with this email already exists",
        });
      }
      res.status(400).json({
        error: err.message,
        message: "Failed to create user",
      });
    }
  },

  async getAll(req, res) {
    try {
      const users = await usersRepository.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await usersRepository.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;
      const userId = req.params.id;

      if (!first_name || !last_name || !email) {
        return res.status(400).render("userEdit", {
          error: "First name, last name, and email are required",
          user: { ...req.body, id: userId },
        });
      }

      const updateData = {
        first_name,
        last_name,
        email,
      };

      if (password && password.trim() !== "") {
        updateData.password = password;
      }

      const updatedUser = await usersRepository.updateUser(userId, updateData);
      res.redirect(`/users/${updatedUser.id}`);
    } catch (err) {
      const user = await usersRepository
        .getUserById(req.params.id)
        .catch(() => null);
      res.status(400).render("userEdit", {
        error: err.message,
        user: user || { ...req.body, id: req.params.id },
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await usersRepository.deleteUser(req.params.id);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default userController;
