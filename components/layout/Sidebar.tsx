"use client";

import { type ReactNode } from "react";
import { Drawer, Box, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RouteIcon from "@mui/icons-material/Route";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { APP_NAME } from "@/constants";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/" },
  { label: "AI Impact", icon: <AnalyticsIcon />, href: "/impact" },
  { label: "Career", icon: <RouteIcon />, href: "/career" },
  { label: "Skills", icon: <SchoolIcon />, href: "/skills" },
  { label: "Profile", icon: <PersonIcon />, href: "/profile" },
];

export default function Sidebar({ active, onNavigate }: { active?: string; onNavigate?: (href: string) => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) return null;

  const drawerWidth = 260;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          top: ["48px", "56px", "64px"],
          height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
        },
      }}
    >
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          {APP_NAME}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Track the Changing World of Work
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={active === item.href}
              onClick={() => onNavigate?.(item.href)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: "auto", mx: 2 }} />
      <List sx={{ px: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
