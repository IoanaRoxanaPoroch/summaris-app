import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import { Summarize } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import COLORS from "../theme/colors";

export const LoginPage = () => {
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
          <SignIn redirectUrl="/" />
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
      </Card>
    </Box>
  );
};
