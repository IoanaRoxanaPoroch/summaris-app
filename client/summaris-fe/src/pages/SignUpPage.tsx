import { SignUp, SignedOut, useAuth } from "@clerk/clerk-react";
import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/login", { replace: true });
    }
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mindWidth: "700px",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <SignedOut>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            maxWidth: "400px",
            alignItems: "center",
          }}
        >
          <SignUp redirectUrl="/" signInUrl="/" />
        </Box>
      </SignedOut>
    </Box>
  );
};
