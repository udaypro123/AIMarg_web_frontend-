"use client";

import { type ReactNode, useState } from "react";
import { Box, Typography, Stack, Card, CardContent, Chip, Grid, Paper, LinearProgress } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import TimelineIcon from "@mui/icons-material/Timeline";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "@/components/common/PageHeader";
import { PrimaryButton, GhostButton } from "@/components/common/Buttons";
import { StatCard } from "@/components/cards/StatCard";

export default function ImpactPage() {
  const [status, setStatus] = useState<string>("Medium");
  const [employment, setEmployment] = useState<string>("Employed");
  const areas = ["Coding", "Design", "Research"];

  return (
    <Stack spacing={3}>
      <PageHeader title="AI Impact" subtitle="Understand and assess how AI affects your career" action={<PrimaryButton startIcon={<AddIcon />}>New Assessment</PrimaryButton>} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Impact Status" value={status} color="warning" icon={<AutoGraphIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Employment" value={employment} color="success" icon={<TimelineIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Assessments" value="3" helperText="Total submitted" color="primary" icon={<HistoryIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Last Updated" value="2d ago" color="secondary" />
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Affected Areas</Typography>
        <Stack spacing={1} sx={{ flexDirection: "row", flexWrap: "wrap" }}>
          {areas.map((area) => (
            <Chip key={area} label={area} color="primary" variant="outlined" />
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Latest Report</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Your most recent AI impact assessment shows a medium impact on your role. This is primarily driven by automation in routine tasks and changes in required skill sets.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>Impact strength</Typography>
          <LinearProgress variant="determinate" value={55} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      </Paper>

      <Stack spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <PrimaryButton variant="outlined">View History</PrimaryButton>
        <GhostButton>Download Report</GhostButton>
      </Stack>
    </Stack>
  );
}