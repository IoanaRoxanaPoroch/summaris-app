import { SignUp } from "@clerk/clerk-react";
import { Box } from "@mui/material";
import React from "react";

export const SignUpPage = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mindWidth: "700px",
      }}
    >
      <SignUp />
    </Box>
  );
};
