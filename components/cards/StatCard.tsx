"use client";

import { type ReactNode } from "react";
import { Card, CardContent, CardActions, Typography, Box, useMediaQuery, useTheme, Skeleton } from "@mui/material";

export function StatCard({
  title,
  value,
  helperText,
  icon,
  progress,
  color = "primary",
  onClick,
}: {
  title: string;
  value: string | number;
  helperText?: string;
  icon?: ReactNode;
  progress?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  onClick?: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: 6,
            }
          : undefined,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {helperText}
              </Typography>
            )}
            {progress !== undefined && (
              <Box sx={{ mt: 1.5 }}>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "divider",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${Math.min(100, Math.max(0, progress))}%`,
                      borderRadius: 3,
                      bgcolor: `${color}.main`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  {progress}% complete
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${color}.light`,
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="70%" height={40} sx={{ mt: 1 }} />
        <Skeleton variant="rounded" width="100%" height={6} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );
}
