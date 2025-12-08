import { useNavigate } from "react-router-dom";
import { Summarize } from "@mui/icons-material";
import { Box, Button, Card, Typography } from "@mui/material";
import COLORS from "../theme/colors";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
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
          maxWidth: "500px",
        }}
      >
        <Box
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "8px",
            backgroundColor: COLORS.PRIMARY_MAIN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.WHITE,
          }}
        >
          <Summarize sx={{ fontSize: "32px" }} />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          404
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          Pagina nu a fost găsită
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Pagina pe care o cauți nu există sau a fost mutată.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: COLORS.PRIMARY_MAIN,
              color: COLORS.PRIMARY_MAIN,
              "&:hover": {
                borderColor: COLORS.PRIMARY_MAIN,
                backgroundColor: "rgba(131, 29, 198, 0.04)",
              },
            }}
          >
            Înapoi
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: COLORS.PRIMARY_MAIN,
              color: COLORS.WHITE,
              "&:hover": {
                backgroundColor: COLORS.PRIMARY_DARK,
              },
            }}
          >
            Mergi la pagina principală
          </Button>
        </Box>
      </Card>
    </Box>
  );
};



