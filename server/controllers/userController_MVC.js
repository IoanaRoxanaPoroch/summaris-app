import { ERROR_MESSAGES } from "../constants/messages.js";
import * as userService from "../services/userService.js";

const userController_MVC = {
  async createUserView(_, res) {
    return res.render("userCreate", { error: null, user: {} });
  },

  async createUser(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body ?? {};

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).render("userCreate", {
          error: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          user: req.body ?? {},
        });
      }

      const userData = {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        password: password.trim(),
        number_of_attempts: 0,
      };

      const createdUser = await userService.createUser(userData);
      return res.redirect(`/users/${createdUser.id}`);
    } catch (err) {
      return res.status(400).render("userCreate", {
        error: err.message,
        user: req.body ?? {},
      });
    }
  },

  async editUserView(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);
      if (!user) {
        return res
          .status(404)
          .render("userEdit", {
            user: null,
            error: ERROR_MESSAGES.USER_NOT_FOUND,
          });
      }

      return res.render("userEdit", { user, error: null });
    } catch (err) {
      return res
        .status(500)
        .render("userEdit", { user: null, error: err.message });
    }
  },

  async updateUser(req, res) {
    const { id } = req.params;

    try {
      const existing = await userService.getUserById(id);
      if (!existing) {
        return res
          .status(404)
          .render("userEdit", {
            user: null,
            error: ERROR_MESSAGES.USER_NOT_FOUND,
          });
      }

      const payload = {
        first_name: (req.body?.first_name ?? "").trim(),
        last_name: (req.body?.last_name ?? "").trim(),
        email: req.body?.email?.trim(),
        password: req.body?.password?.trim(),
      };

      if (!payload.password) delete payload.password;

      const updated = await userService.updateUser(id, payload);
      return res.redirect(`/users/${updated.id}`);
    } catch (err) {
      const user = { id, ...(req.body ?? {}) };
      return res.status(400).render("userEdit", { user, error: err.message });
    }
  },

  async getAllUsersView(_, res) {
    try {
      const users = await userService.getAllUsers();
      return res.render("usersIndex", { title: "Users", users, error: null });
    } catch (err) {
      return res.status(500).render("usersIndex", {
        title: "Users",
        users: [],
        error: err.message,
      });
    }
  },

  async getUserByIdView(req, res) {
    try {
      const { id } = req.params;

      if (id === "create") {
        return res
          .status(404)
          .render("userDetails", { user: null, error: "Invalid user ID" });
      }

      const user = await userService.getUserById(id);
      if (!user) {
        return res
          .status(404)
          .render("userDetails", {
            user: null,
            error: ERROR_MESSAGES.USER_NOT_FOUND,
          });
      }

      return res.render("userDetails", { user, error: null });
    } catch (err) {
      return res
        .status(500)
        .render("userDetails", { user: null, error: err.message });
    }
  },
};

export default userController_MVC;
