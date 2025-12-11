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
        const clerkId = user.id;
        
        console.log("UserSync: Starting sync for user:", { email, clerkId });
        
        if (!email) {
          console.warn("UserSync: User email not found, skipping sync");
          return;
        }

        // Verifică dacă utilizatorul există folosind apiClient
        try {
          const response = await get("/users/api/email", { email });
          console.log("UserSync: Existing user found:", response.user);
          hasSynced.current = true;
          return;
        } catch (error) {
          // Dacă utilizatorul nu există (404), înseamnă că webhook-ul nu a funcționat
          // În acest caz, creăm user-ul manual ca fallback
          if (error.status === 404) {
            console.warn("UserSync: User not found in DB, webhook may have failed. Creating user as fallback...");
            
            const firstName = user.firstName || "";
            const lastName = user.lastName || "";

            try {
              const result = await post("/users/api", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: "",
              });
              console.log("UserSync: User created as fallback:", result);
              hasSynced.current = true;
              return;
            } catch (createError) {
              console.error("UserSync: Error creating user as fallback:", createError);
              throw createError;
            }
          }
          console.error("UserSync: Error checking existing user:", error);
          throw error;
        }

        console.log("UserSync: User sync completed");
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
