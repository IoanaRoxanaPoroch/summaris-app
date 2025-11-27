import { usersRepository } from "../repositories/userRepository.js";

const userController_MVC = {
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

  async getAllView(req, res) {
    try {
      const users = await usersRepository.getAllUsers();
      res.render("usersIndex", {
        title: "Users",
        users: users,
      });
    } catch (err) {
      res.status(500).render("usersIndex", {
        title: "Users",
        users: [],
        error: err.message,
      });
    }
  },

  async getByIdView(req, res) {
    try {
      if (req.params.id === "create" || req.params.id === "api") {
        return res.status(404).render("userDetails", {
          user: null,
          error: "Invalid user ID",
        });
      }

      const user = await usersRepository.getUserById(req.params.id);
      if (!user) {
        return res.status(404).render("userDetails", {
          user: null,
          error: "User not found",
        });
      }
      res.render("userDetails", { user: user });
    } catch (err) {
      res.status(404).render("userDetails", {
        user: null,
        error: err.message,
      });
    }
  },

  async editView(req, res) {
    try {
      const user = await usersRepository.getUserById(req.params.id);
      if (!user) {
        return res.status(404).render("userEdit", {
          user: null,
          error: "User not found",
        });
      }
      res.render("userEdit", { user: user, error: null });
    } catch (err) {
      res.status(404).render("userEdit", {
        user: null,
        error: err.message,
      });
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

export default userController_MVC;
