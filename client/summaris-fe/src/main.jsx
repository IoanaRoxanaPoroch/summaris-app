import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ro } from "./locales/ro.js";

import "./index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

let navigateFunction = null;
export const setNavigateFunction = (navigate) => {
  navigateFunction = navigate;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      localization={ro}
      appearance={{
        baseTheme: "light",
      }}
      routerPush={(to) => {
        if (navigateFunction) {
          navigateFunction(to);
        } else {
          window.location.href = to;
        }
      }}
      routerReplace={(to) => {
        if (navigateFunction) {
          navigateFunction(to, { replace: true });
        } else {
          window.location.replace(to);
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
