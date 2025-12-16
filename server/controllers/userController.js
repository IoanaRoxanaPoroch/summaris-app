import * as userService from "../services/userService.js";

const userController = {
  async createUser(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email) {
        return res.status(400).json({
          error: "All fields are required",
          message: "First name, last name, and email are required",
        });
      }

      const userData = {
        first_name,
        last_name,
        email,
        password: password || "",
        number_of_attempts: 0,
      };

      try {
        const createdUser = await userService.createUser(userData);
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
        if (err.message === "User already exists") {
          const existingUser = await userService.getUserByEmail(email);
          return res.status(200).json({
            message: "User already exists",
            user: {
              id: existingUser.id,
              first_name: existingUser.first_name,
              last_name: existingUser.last_name,
              email: existingUser.email,
              created_at: existingUser.created_at,
            },
          });
        }
        throw err;
      }
    } catch (err) {
      if (err.code === "P2002") {
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

  async getUserByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          error: "Email is required",
          message: "Please provide an email address",
        });
      }

      const user = await userService.getUserByEmail(email);
      res.json({
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          created_at: user.created_at,
        },
      });
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to get user",
      });
    }
  },

  async getAllUsers(_, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default userController;
