"use client";

import { type ReactNode } from "react";
import { Box, Container, Typography, AppBar, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

export default function AppShell({ children, title, hideHeader = false, maxWidth = "xl" }: { children: ReactNode; title?: string; hideHeader?: boolean; maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false; }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {!isMobile && <Sidebar />}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!hideHeader && <Navbar />}
        <Box component="main" sx={{ flex: 1, pb: { xs: 8, md: 0 } }}>
          <Container maxWidth={maxWidth} sx={{ py: { xs: 2, md: 4 } }}>
            {title && (
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                {title}
              </Typography>
            )}
            {children}
          </Container>
        </Box>
        {isMobile && <BottomNav />}
      </Box>
    </Box>
  );
}
