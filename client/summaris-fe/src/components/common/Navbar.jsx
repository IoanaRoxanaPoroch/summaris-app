import { Box, Chip, Paper, Typography } from "@mui/material";
import COLORS from "../../theme/colors";

export function Navbar({
  title = "Pagina curentă",
  documentCount = 0,
  plan = "Gratuit",
}) {
  const getPlanColor = (planName) => {
    switch (planName) {
      case "Pro":
      case "Premium":
        return COLORS.PLAN_PREMIUM;
      case "Gratuit":
      default:
        return COLORS.PLAN_FREE;
    }
  };

  return (
    <Paper
      sx={{
        padding: "16px 24px",
        borderRadius: 0,
        boxShadow: `0 2px 4px ${COLORS.SHADOW_DEFAULT}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.BACKGROUND_WHITE,
        height: "64px",
        borderBottom: `1px solid ${COLORS.BORDER_DEFAULT}`,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}
      >
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY }}>
          {documentCount} {documentCount === 1 ? "document" : "documente"}
        </Typography>
        <Chip
          label={plan}
          sx={{ backgroundColor: getPlanColor(plan), color: COLORS.WHITE }}
        />
      </Box>
    </Paper>
  );
}
