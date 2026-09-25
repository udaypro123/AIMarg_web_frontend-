"use client";

import { useRef, useState, type ReactNode } from "react";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";

export default function Loading({
  fullScreen = false,
  message = "Loading...",
  size = 48,
}: {
  fullScreen?: boolean;
  message?: string;
  size?: number;
}) {
  const content = (
    <Stack spacing={2} sx={{ py: 6, alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Stack>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}