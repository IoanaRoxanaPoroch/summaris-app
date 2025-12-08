import { Check, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import COLORS from "../../theme/colors";

const PlanCard = ({ plan, isCurrent, onSelect }) => {
  const { id, name, price, period, features, popular } = plan;

  // Determinare culoare în funcție de plan
  const getPlanColor = () => {
    switch (id) {
      case "free":
        return COLORS.PLAN_FREE;
      case "pro":
        return COLORS.PLAN_PRO;
      case "premium":
        return COLORS.PLAN_PREMIUM;
      default:
        return COLORS.PRIMARY_MAIN;
    }
  };

  const color = getPlanColor();

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: popular
          ? `2px solid ${color}`
          : `1px solid ${COLORS.BORDER_DEFAULT}`,
        borderRadius: "12px",
        boxShadow: popular
          ? `0 8px 24px ${COLORS.SHADOW_PURPLE}`
          : `0 2px 8px ${COLORS.SHADOW_DEFAULT}`,
        transition: "all 0.2s",
        backgroundColor: COLORS.BACKGROUND_WHITE,

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 32px ${COLORS.SHADOW_PURPLE_STRONG}`,
        },
      }}
    >
      {popular && (
        <Chip
          label="Popular"
          icon={<Star sx={{ fontSize: 14 }} />}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: color,
            color: COLORS.WHITE,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      )}

      <CardContent sx={{ padding: "24px", flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            marginBottom: "8px",
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          {name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "16px",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {price}€
          </Typography>
          <Typography
            variant="body2"
            color={COLORS.TEXT_SECONDARY}
            sx={{ ml: 1 }}
          >
            /{period}
          </Typography>
        </Box>

        <List sx={{ padding: 0 }}>
          {features.map((feature, i) => (
            <ListItem key={i} sx={{ padding: "4px 0" }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Check sx={{ color, fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <CardActions sx={{ padding: "12px 24px 24px" }}>
        <Button
          fullWidth
          variant={isCurrent ? "contained" : popular ? "contained" : "outlined"}
          sx={{
            backgroundColor: isCurrent || popular ? color : COLORS.WHITE,
            color: isCurrent || popular ? COLORS.WHITE : color,
            borderColor: color,
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
            "&:hover": {
              backgroundColor:
                isCurrent || popular ? color : COLORS.PRIMARY_ULTRA_LIGHT,
            },
          }}
          disabled={isCurrent}
          onClick={() => onSelect?.(id)}
        >
          {isCurrent ? "Planul curent" : "Upgrade"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlanCard;
