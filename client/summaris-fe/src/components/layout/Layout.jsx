import { useUser } from "@clerk/clerk-react";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { get } from "../../services/apiClient";
import COLORS from "../../theme/colors";
import { Navbar } from "../common/Navbar";
import { Sidebar } from "../common/Sidebar";

function Layout({ children }) {
  const { user } = useUser();
  const [plan, setPlan] = useState("Gratuit");

  const fetchPlan = useCallback(async () => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;
    try {
      const res = await get("/subscriptions/api", { email });
      setPlan(res.subscription?.name || "Gratuit");
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  useEffect(() => {
    const handler = () => fetchPlan();
    window.addEventListener("plan-updated", handler);
    return () => window.removeEventListener("plan-updated", handler);
  }, [fetchPlan]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.BACKGROUND_MAIN,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar plan={plan} />

        <Box sx={{ flex: 1, overflow: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;
