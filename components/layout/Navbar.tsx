"use client";

import { type ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, useMediaQuery, useTheme, Box } from "@mui/material";
import { APP_NAME } from "@/constants";

export default function Navbar({ right }: { right?: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: isMobile ? "0.85rem" : "0.95rem",
              }}
            >
              Z
            </Box>
            {!isMobile && (
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                {APP_NAME}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{right}</Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
