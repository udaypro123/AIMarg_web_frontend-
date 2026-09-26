
"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { APP_NAME, ROUTES } from "@/constants";

type NavbarProps = {
  right?: ReactNode;
};

const navItems = [
  {
    label: "AI Impact",
    href: ROUTES.IMPACT,
  },
  {
    label: "Career",
    href: ROUTES.CAREER,
  },
  {
    label: "Skills",
    href: ROUTES.SKILLS,
  },
];

export default function Navbar({ right }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: theme.zIndex.appBar,
          bgcolor: "rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
          color: "text.primary",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1440,
            px: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
            },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 64,
                md: 72,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Brand */}
            <Link
              href="/"
              aria-label={`${APP_NAME} home`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  flexShrink: 0,
                }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(circle, rgba(9, 9, 121, 1) 0%, rgba(55, 55, 196, 1) 50%, rgba(9, 9, 121, 1) 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    boxShadow:
                      "0 8px 22px rgba(37, 99, 235, 0.24)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow:
                        "0 12px 28px rgba(37, 99, 235, 0.32)",
                    },
                  }}
                >
                  Z
                </Box>

                {/* Brand name */}
                {!isMobile && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: {
                        md: "1.05rem",
                        lg: "1.15rem",
                      },
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                      color: "text.primary",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {APP_NAME}
                  </Typography>
                )}
              </Box>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                component="nav"
                aria-label="Main navigation"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  p: 0.5,
                  borderRadius: "14px",
                  bgcolor: "rgba(248, 250, 252, 0.8)",
                  border: "1px solid",
                  borderColor: "rgba(15, 23, 42, 0.06)",
                }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        px: {
                          md: 1.5,
                          lg: 2,
                        },
                        py: 1,
                        borderRadius: "10px",
                        color: "text.secondary",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        transition:
                          "color 0.2s ease, background-color 0.2s ease, transform 0.2s ease",
                        "&:hover": {
                          color: "primary.main",
                          bgcolor: "rgba(37, 99, 235, 0.08)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {item.label}
                    </Box>
                  </Link>
                ))}
              </Box>
            )}

            {/* Right Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: 1,
                  sm: 1.5,
                },
              }}
            >
              {!isMobile && right}

              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  onClick={handleDrawerToggle}
                  aria-label="Open navigation menu"
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <MenuRoundedIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper:{
            sx: {
              width: {
                xs: "85%",
                sm: 360,
              },
              maxWidth: 360,
              p: 2,
              bgcolor: "background.paper",
            },
          }
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Link
              href="/"
              onClick={handleDrawerToggle}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(circle, rgba(9, 9, 121, 1) 0%, rgba(55, 55, 196, 1) 50%, rgba(9, 9, 121, 1) 100%)",
                    color: "#fff",
                    fontWeight: 800,
                  }}
                >
                  Z
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {APP_NAME}
                </Typography>
              </Box>
            </Link>

            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Close navigation menu"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* Mobile Links */}
          <Box
            component="nav"
            aria-label="Mobile navigation"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              pt: 3,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleDrawerToggle}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.75,
                    borderRadius: "14px",
                    color: "text.primary",
                    fontSize: "1rem",
                    fontWeight: 600,
                    transition:
                      "background-color 0.2s ease, color 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(37, 99, 235, 0.08)",
                      color: "primary.main",
                    },
                  }}
                >
                  {item.label}

                  <ArrowForwardRoundedIcon
                    sx={{
                      fontSize: 19,
                      color: "text.secondary",
                    }}
                  />
                </Box>
              </Link>
            ))}
          </Box>

          {/* Mobile Right Content */}
          {right && (
            <Box
              sx={{
                mt: "auto",
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              {right}
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

