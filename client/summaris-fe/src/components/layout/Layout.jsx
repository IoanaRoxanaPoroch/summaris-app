import { Box } from "@mui/material";

import COLORS from "../../theme/colors";
import { Navbar } from "../common/Navbar";
import { Sidebar } from "../common/Sidebar";

function Layout({ children }) {
  console.log("in layout");
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
        <Navbar />

        <Box sx={{ flex: 1, overflow: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;
