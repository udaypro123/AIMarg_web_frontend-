"use client";

import { type ReactNode } from "react";
import { Box, Typography, Stack, Card, CardContent, Chip, Grid, Paper, Divider, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PendingIcon from "@mui/icons-material/Pending";
import PageHeader from "@/components/common/PageHeader";
import { PrimaryButton, GhostButton } from "@/components/common/Buttons";

const milestones = [
  { id: "assessment", label: "Assessment", completed: true },
  { id: "skill-gap", label: "Skill Gap", completed: true },
  { id: "learning", label: "Learning", completed: true },
  { id: "project", label: "Project", completed: false, active: true },
  { id: "applications", label: "Applications", completed: false },
  { id: "interview", label: "Interview", completed: false },
  { id: "transition", label: "Career Transition", completed: false },
];

const statusIcons: Record<string, ReactNode> = {
  completed: <CheckCircleIcon color="success" />,
  active: <PendingIcon color="primary" />,
  pending: <RadioButtonUncheckedIcon color="disabled" />,
};

export default function CareerPage() {
  const progress = Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100);

  return (
    <Stack spacing={3}>
      <PageHeader title="Career Journey" subtitle="Track your milestones and recommended next steps" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Progress</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{milestones.filter((m) => m.completed).length} / {milestones.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Milestones</Typography>
        <Stack spacing={2}>
          {milestones.map((milestone) => (
            <Card key={milestone.id} variant="outlined">
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ color: milestone.completed ? "success.main" : milestone.active ? "primary.main" : "text.disabled" }}>
                  {statusIcons[milestone.completed ? "completed" : milestone.active ? "active" : "pending"]}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{milestone.label}</Typography>
                </Box>
                {milestone.active && <Chip label="In progress" size="small" color="primary" />}
                {milestone.completed && <Chip label="Completed" size="small" color="success" variant="outlined" />}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

      <Stack spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <PrimaryButton variant="outlined">Get Recommendations</PrimaryButton>
        <GhostButton>View History</GhostButton>
      </Stack>
    </Stack>
  );
}