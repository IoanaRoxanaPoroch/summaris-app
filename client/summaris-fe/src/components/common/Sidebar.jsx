import { SignOutButton, useUser } from "@clerk/clerk-react";

import { Folder, Home, Logout, Summarize } from "@mui/icons-material";
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import COLORS from "../../theme/colors";

export function Sidebar() {
  const { isSignedIn } = useUser();
  const menuItems = [
    { id: "home", label: "Acasă", icon: <Home />, path: "/home" },
    // {
    //   id: "dashboard",
    //   label: "Dashboard",
    //   icon: <Dashboard />,
    //   path: "/dashboard",
    // },
    {
      id: "documents",
      label: "Documente",
      icon: <Folder />,
      path: "/my-docs",
    },
    // { id: "settings", label: "Setări", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Paper
      sx={{
        width: "280px",
        height: "100%",
        backgroundColor: COLORS.BACKGROUND_WHITE,
        boxShadow: `2px 0 8px ${COLORS.SHADOW_PURPLE}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          padding: "12px 24px",
          height: "64px",
          borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
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
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: COLORS.PRIMARY_MAIN }}
        >
          Summaris
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                sx={{
                  padding: "12px 24px",
                  backgroundColor: isActive
                    ? COLORS.BACKGROUND_SELECTED
                    : "transparent",
                  borderLeft: isActive
                    ? `4px solid ${COLORS.PRIMARY_MAIN}`
                    : "none",
                  color: isActive ? COLORS.PRIMARY_MAIN : COLORS.TEXT_PRIMARY,
                  fontWeight: isActive ? 600 : 400,
                  "&:hover": { backgroundColor: COLORS.BACKGROUND_HOVER },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    color: isActive
                      ? COLORS.PRIMARY_MAIN
                      : COLORS.TEXT_SECONDARY,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      {isSignedIn && (
        <Box
          sx={{
            padding: "12px 24px",
            borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <SignOutButton redirectUrl="/login">
            <Button
              variant="text"
              sx={{ textTransform: "none", color: COLORS.PRIMARY_MAIN }}
              startIcon={<Logout sx={{ color: COLORS.PRIMARY_MAIN }} />}
            >
              Deconectare
            </Button>
          </SignOutButton>
        </Box>
      )}
    </Paper>
  );
}
