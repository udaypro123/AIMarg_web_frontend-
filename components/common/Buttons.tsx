"use client";

import { Button, type ButtonProps } from "@mui/material";

export interface PrimaryButtonProps extends ButtonProps {
  loading?: boolean;
}

export function PrimaryButton({ loading, disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      sx={{ minWidth: 120, py: 1.2, fontWeight: 600 }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}

export function SecondaryButton({ loading, disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      variant="outlined"
      disabled={disabled || loading}
      sx={{ minWidth: 120, py: 1.2, fontWeight: 600 }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}

export function GhostButton({ loading, disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      variant="text"
      disabled={disabled || loading}
      sx={{ minWidth: 120, py: 1.2, fontWeight: 600 }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}