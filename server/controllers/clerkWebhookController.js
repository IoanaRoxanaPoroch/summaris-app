import { usersRepository } from "../repositories/userRepository.js";

const clerkWebhookController = {
  async handleUserCreated(req, res) {
    try {
      const { data } = req.body;

      // Clerk webhook payload structure
      // For user.created event, data contains user information
      const clerkUserId = data.id;
      const email = data.email_addresses?.[0]?.email_address;
      const firstName = data.first_name || "";
      const lastName = data.last_name || "";

      if (!email) {
        return res.status(400).json({
          error: "Email is required",
          message: "User email not found in webhook payload",
        });
      }

      // Check if user already exists
      const existingUser = await usersRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(200).json({
          message: "User already exists in database",
          user: existingUser,
        });
      }

      // Create user in database
      const userData = {
        first_name: firstName || "Unknown",
        last_name: lastName || "Unknown",
        email: email,
        password: "", // Clerk handles authentication, so we don't store password
        number_of_attempts: 0,
      };

      const createdUser = await usersRepository.createUser(userData);
      
      res.status(201).json({
        message: "User synced to database successfully",
        user: {
          id: createdUser.id,
          clerk_id: clerkUserId,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          email: createdUser.email,
        },
      });
    } catch (err) {
      console.error("Error handling Clerk webhook:", err);
      if (err.code === "P2002") {
        // Prisma unique constraint error
        return res.status(409).json({
          error: "Email already exists",
          message: "A user with this email already exists",
        });
      }
      res.status(500).json({
        error: err.message,
        message: "Failed to sync user to database",
      });
    }
  },

  async handleWebhook(req, res) {
    try {
      const { type, data } = req.body;

      // Handle different Clerk webhook events
      switch (type) {
        case "user.created":
          return await this.handleUserCreated(req, res);
        
        case "user.updated":
          // Optionally handle user updates
          return res.status(200).json({ message: "User update received" });
        
        case "user.deleted":
          // Optionally handle user deletion
          return res.status(200).json({ message: "User deletion received" });
        
        default:
          return res.status(200).json({ message: "Webhook event not handled" });
      }
    } catch (err) {
      console.error("Error handling webhook:", err);
      res.status(500).json({
        error: err.message,
        message: "Failed to process webhook",
      });
    }
  },
};

export default clerkWebhookController;

