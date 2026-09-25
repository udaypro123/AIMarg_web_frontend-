"use client";

import { type ReactNode } from "react";
import { Box, Typography, Stack, Button, Paper } from "@mui/material";

export function AuthContainer({ children, maxWidth = "xs" }: { children: ReactNode; maxWidth?: "xs" | "sm" | "md" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>{children}</Box>
    </Box>
  );
}
