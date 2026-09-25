"use client";

import { type ReactNode } from "react";
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RouteIcon from "@mui/icons-material/Route";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

export default function BottomNav({ active, onNavigate }: { active?: string; onNavigate?: (value: string) => void }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  if (isDesktop) return null;

  const items = [
    { label: "Home", icon: <DashboardIcon />, href: "/" },
    { label: "Impact", icon: <AnalyticsIcon />, href: "/impact" },
    { label: "Career", icon: <RouteIcon />, href: "/career" },
    { label: "Skills", icon: <SchoolIcon />, href: "/skills" },
    { label: "Profile", icon: <PersonIcon />, href: "/profile" },
  ];

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: 1,
        borderColor: "divider",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={active}
        onChange={(_, value) => onNavigate?.(value)}
        showLabels
        sx={{ bgcolor: "background.paper" }}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.href}
            label={item.label}
            icon={item.icon}
            value={item.href}
            sx={{ minHeight: 64 }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
