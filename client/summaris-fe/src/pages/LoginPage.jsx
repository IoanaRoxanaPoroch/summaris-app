import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { Summarize } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import COLORS from "../theme/colors";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  // Redirecționează automat către /home dacă utilizatorul este deja autentificat
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/home", { replace: true });
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
      }}
    >
      <Card
        sx={{
          padding: "40px",
          display: "flex",
          gap: "40px",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "400px",
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: COLORS.PRIMARY_MAIN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.WHITE,
          }}
        >
          <Summarize sx={{ fontSize: "24px" }} />
        </Box>

        <Typography variant="h5" gutterBottom>
          Bun venit pe pagina Summaris!
        </Typography>

        <SignedOut>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <SignIn
              redirectUrl="/home"
              signUpUrl="/sign-up"
              appearance={{
                baseTheme: "light",
              }}
            />
          </Box>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/login" />
        </SignedIn>
      </Card>
    </Box>
  );
};
