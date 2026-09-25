"use client";

import { type ReactNode, useState } from "react";
import { Box, Typography, Tabs, Tab, Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RouteIcon from "@mui/icons-material/Route";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { label: "Home", icon: <DashboardIcon />, href: "/" },
  { label: "Impact", icon: <AnalyticsIcon />, href: "/impact" },
  { label: "Career", icon: <RouteIcon />, href: "/career" },
  { label: "Skills", icon: <SchoolIcon />, href: "/skills" },
  { label: "Profile", icon: <PersonIcon />, href: "/profile" },
];

export function MobileTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(() => tabs.findIndex((t) => pathname === t.href) || 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(tabs[newValue].href);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <Tabs value={value} onChange={handleChange} variant="fullWidth" sx={{ minHeight: 64 }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            iconPosition="top"
            sx={{ minHeight: 64, py: 1 }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
