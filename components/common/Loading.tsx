"use client";

import type { CSSProperties } from "react";
import { Box, Typography } from "@mui/material";

export default function Loading({
  fullScreen = false,
  message = "Getting things ready",
  size = 28,
}: {
  fullScreen?: boolean;
  message?: string;
  size?: number;
}) {
  return (
    <Box
      className={`brand-loader${fullScreen ? " is-fullscreen" : ""}`}
      role="status"
      aria-label={message || "Loading"}
      style={{ "--loader-size": `${size}px` } as CSSProperties}
    >
      <Box className="brand-loader-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </Box>
      {message && <Typography className="brand-loader-message">{message}</Typography>}
      <span className="brand-loader-sr-only">Loading</span>
    </Box>
  );
}
