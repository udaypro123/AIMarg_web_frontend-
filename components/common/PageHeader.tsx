"use client";

import { type ReactNode } from "react";
import { Box, Typography, Breadcrumbs, Link, IconButton, useMediaQuery, useTheme, Stack } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { ROUTES } from "@/constants";

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  onBack,
  children,
}: {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  action?: ReactNode;
  onBack?: () => void;
  children?: ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 3 }}>
      {(breadcrumbs || onBack) && (
        <Box sx={{ mb: 1.5 }}>
          {onBack ? (
            <IconButton onClick={onBack} size="small" sx={{ mb: 0.5 }}>
              <NavigateBeforeIcon />
            </IconButton>
          ) : breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumbs separator="/" aria-label="breadcrumb">
              {breadcrumbs.map((crumb, index) =>
                crumb.href && index < breadcrumbs.length - 1 ? (
                  <Link key={index} href={crumb.href} underline="hover" color="inherit">
                    {crumb.label}
                  </Link>
                ) : (
                  <Typography key={index} color="text.primary">
                    {crumb.label}
                  </Typography>
                )
              )}
            </Breadcrumbs>
          ) : null}
        </Box>
      )}
      <Stack
        spacing={2}
        sx={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {title && (
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
          {children}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>
    </Box>
  );
}