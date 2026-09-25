"use client";

import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, Typography, Box, Stack, Divider, useMediaQuery, useTheme } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";

export function FeatureCard({
  title,
  subtitle,
  icon,
  action,
  children,
  footer,
  sx,
}: {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  sx?: object;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", ...sx }}>
      {(title || icon || action) && (
        <CardHeader
          avatar={icon}
          title={title}
          subheader={subtitle}
          action={action}
          titleTypographyProps={{ variant: "h6" }}
          subheaderTypographyProps={{ variant: "body2" }}
          sx={{
            pb: title ? 1 : 0,
            "& .MuiCardHeader-action": { alignSelf: "center" },
          }}
        />
      )}
      {title && !icon && <Divider />}
      {children && (
        <CardContent sx={{ flex: 1, "&:last-child": { pb: footer ? 2 : undefined } }}>{children}</CardContent>
      )}
      {footer && (
        <Box sx={{ px: 2, pb: 2, pt: 0 }}>
          <Divider sx={{ mb: 1.5 }} />
          {footer}
        </Box>
      )}
    </Card>
  );
}
