"use client";

import { type ReactNode } from "react";
import { Box, Typography, Stack, useMediaQuery, useTheme, Button, Paper } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import RouteIcon from "@mui/icons-material/Route";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { StatCard } from "../components/cards/StatCard";
import { PrimaryButton, GhostButton } from "../components/common/Buttons";

const DASHBOARD_CARDS = [
  {
    title: "AI Impact",
    value: "Medium",
    helperText: "Last assessed 3 days ago",
    color: "warning" as const,
    icon: <TrendingUpIcon />,
  },
  {
    title: "Skill Progress",
    value: "64%",
    helperText: "12 of 19 skills",
    progress: 64,
    color: "primary" as const,
    icon: <SchoolIcon />,
  },
  {
    title: "Career Journey",
    value: "4/7",
    helperText: "Milestones completed",
    color: "success" as const,
    icon: <RouteIcon />,
  },
  {
    title: "Employment",
    value: "Employed",
    helperText: "Stable",
    color: "success" as const,
    icon: <AutoGraphIcon />,
  },
];

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, mb: 0.5 }}>
          Good Morning, Uday
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here is what is happening with your career today.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
        {DASHBOARD_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Recommended Next Step
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Complete your AI impact assessment to get personalized career recommendations and skill-gap analysis.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
          <PrimaryButton endIcon={<ArrowForwardIcon />}>Start Assessment</PrimaryButton>
          <GhostButton>View History</GhostButton>
        </Box>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            AI Impact Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your last assessment shows a medium impact on your role. Review detailed insights and recommended actions.
          </Typography>
          <Button variant="text" sx={{ px: 0 }} endIcon={<ArrowForwardIcon />}>
            View report
          </Button>
        </Paper>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Learning Plan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Continue your learning path. 3 courses remaining this week to close your skill gap.
          </Typography>
          <Button variant="text" sx={{ px: 0 }} endIcon={<ArrowForwardIcon />}>
            Continue learning
          </Button>
        </Paper>
      </Box>
    </Stack>
  );
}
