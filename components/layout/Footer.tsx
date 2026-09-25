"use client";

import { Box, Typography, Link, Container, Stack } from "@mui/material";
import { APP_NAME } from "@/constants";

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        py: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              Z
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
              {APP_NAME}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            sx={{ flexWrap: "wrap", justifyContent: "center" }}
          >
            <Typography variant="body2" color="text.secondary" component="a" href="/privacy" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Privacy
            </Typography>
            <Typography variant="body2" color="text.secondary" component="a" href="/terms" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Terms
            </Typography>
            <Typography variant="body2" color="text.secondary" component="a" href="/contact" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Contact
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}