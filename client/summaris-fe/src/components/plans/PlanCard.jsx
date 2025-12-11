import { CheckCircle } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import COLORS from "../../theme/colors";

export const PlanCard = ({ plan, handleClick, isLoading, isActive }) => {
  const { id, title, uploads, limit, price } = plan;
  return (
    <Card
      key={id}
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 8px COLORS.SHADOW_DEFAULT",
        position: "relative",
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <CheckCircle
            sx={{
              color: COLORS.PRIMARY_MAIN,
              fontSize: 28,
            }}
          />
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {uploads}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {limit}
        </Typography>
        <Typography variant="body1" fontWeight={600} sx={{ mt: 1, mb: 1 }}>
          {price}
        </Typography>
        {id !== "free" && (
          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 1,
              backgroundColor: COLORS.PRIMARY_MAIN,
              "&:hover": { backgroundColor: COLORS.PURPLE_LAVANDER },
            }}
            disabled={isLoading || isActive}
            onClick={handleClick}
          >
            {isLoading ? "Se procesează..." : "Alege planul"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
