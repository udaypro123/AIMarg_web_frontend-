"use client";

import { type ReactNode, useState } from "react";
import { Box, Typography, Stack, Card, CardContent, Chip, Grid, Paper, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import PageHeader from "@/components/common/PageHeader";
import { PrimaryButton, GhostButton } from "@/components/common/Buttons";
import { StatCard } from "@/components/cards/StatCard";

const currentSkills = [
  { name: "JavaScript", progress: 90 },
  { name: "React", progress: 85 },
  { name: "Node.js", progress: 70 },
  { name: "AI Integration", progress: 30 },
  { name: "Cloud", progress: 40 },
];

const requiredSkills = [
  { name: "JavaScript", target: 100 },
  { name: "React", target: 100 },
  { name: "System Design", target: 80 },
  { name: "Cloud", target: 80 },
  { name: "AI Integration", target: 90 },
];

export default function SkillsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const getGap = (name: string) => {
    const current = currentSkills.find((s) => s.name === name)?.progress ?? 0;
    const target = requiredSkills.find((s) => s.name === name)?.target ?? 0;
    return Math.max(0, target - current);
  };

  return (
    <Stack spacing={3}>
      <PageHeader title="Skills" subtitle="Track your current skills, required skills, and skill gaps" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Current Skills" value={String(currentSkills.length)} color="primary" icon={<SchoolIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Avg Progress" value="65%" progress={65} color="success" icon={<TrendingUpIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Skill Gaps" value="3" color="warning" icon={<WarningIcon />} />
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Skill Gap Analysis</Typography>
        <TableContainer>
          <Table size={selected ? "medium" : "small"}>
            <TableHead>
              <TableRow>
                <TableCell>Skill</TableCell>
                <TableCell>Current</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Gap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requiredSkills.map((skill) => {
                const current = currentSkills.find((s) => s.name === skill.name)?.progress ?? 0;
                const gap = getGap(skill.name);
                return (
                  <TableRow key={skill.name} hover selected={selected === skill.name} onClick={() => setSelected(skill.name)} sx={{ cursor: "pointer" }}>
                    <TableCell sx={{ fontWeight: 600 }}>{skill.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress variant="determinate" value={current} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                        <Typography variant="caption">{current}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress variant="determinate" value={skill.target} sx={{ flex: 1, height: 6, borderRadius: 3 }} color="secondary" />
                        <Typography variant="caption">{skill.target}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={`${gap}%`} color={gap > 0 ? "warning" : "success"} size="small" variant={gap > 0 ? "filled" : "outlined"} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Stack spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <PrimaryButton variant="outlined">Update Progress</PrimaryButton>
        <GhostButton>View Learning Path</GhostButton>
      </Stack>
    </Stack>
  );
}