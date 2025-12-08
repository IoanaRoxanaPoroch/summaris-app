import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { get, post } from "../../services/apiClient";

export function UserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      return;
    }

    if (hasSynced.current) {
      return;
    }

    const syncUser = async () => {
      try {
        const email = user.emailAddresses?.[0]?.emailAddress;
        if (!email) {
          console.warn("UserSync: User email not found, skipping sync");
          return;
        }

        // Verifică dacă utilizatorul există folosind apiClient
        let existingUser = null;
        try {
          existingUser = await get("/users/api/email", { email });
        } catch (error) {
          // Dacă utilizatorul nu există (404), continuă cu crearea
          if (error.status !== 404) {
            throw error;
          }
        }

        if (existingUser) {
          hasSynced.current = true;
          return;
        }

        const firstName = user.firstName || "";
        const lastName = user.lastName || "";

        // Creează utilizatorul folosind apiClient
        const result = await post("/users/api", {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: "",
        });

        hasSynced.current = true;
      } catch (error) {
        if (
          error.error === "Email already exists" ||
          error.message?.includes("already exists")
        ) {
          hasSynced.current = true;
          return;
        }

        console.error("UserSync: Error syncing user to database:", error);
        console.error("UserSync: Error details:", {
          message: error.message,
          error: error.error,
          response: error.response,
        });
      }
    };

    syncUser();
  }, [user, isLoaded, isSignedIn]);

  return null;
}
