"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, CircularProgress, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { CAREER_MILESTONES } from "@/constants";
import { getCareerJourney, updateCareerJourney } from "@/services/career.service";
import type { CareerJourney } from "@/types/api";

export default function CareerPage() {
  const [journey, setJourney] = useState<CareerJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getCareerJourney()
      .then((data) => {
        if (active) setJourney(data);
      })
      .catch(() => {
        if (active) setError("Your career journey could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const milestones = journey?.milestones ?? [];
  const completedCount = milestones.filter((milestone) => milestone.completed).length;
  const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
  const currentKey = journey?.currentMilestone;

  const toggleMilestone = async (key: string) => {
    if (!journey || savingKey) return;
    setSavingKey(key);
    setError("");
    const nextMilestones = journey.milestones.map((milestone) => {
      if (milestone.key !== key) return milestone;
      const completed = !milestone.completed;
      return { ...milestone, completed, completedAt: completed ? new Date().toISOString() : undefined };
    });
    try {
      setJourney(await updateCareerJourney(nextMilestones));
    } catch {
      setError("That milestone could not be updated. Try again in a moment.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <Stack spacing={3}>
      <Box className="page-heading-row">
        <Box>
          <Typography className="page-eyebrow">YOUR NEXT CHAPTER</Typography>
          <Typography variant="h1" className="page-title">Career path</Typography>
          <Typography className="page-subtitle">A practical route from where you are to where you want to be.</Typography>
        </Box>
        <Button component={Link} href="/skills" variant="outlined">Review skills</Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Box className="journey-summary">
        <Box className="journey-summary-copy">
          <Typography className="impact-overview-label">YOUR JOURNEY</Typography>
          <Typography className="journey-progress-value">{loading ? "—" : `${progress}%`}</Typography>
          <Typography className="impact-overview-caption">
            {loading ? "Loading milestones" : `${completedCount} of ${milestones.length} milestones complete`}
          </Typography>
        </Box>
        <Box className="journey-progress-track">
          <LinearProgress variant="determinate" value={progress} />
          <Box className="journey-progress-ends"><span>Start</span><span>Transition</span></Box>
        </Box>
        <Box className="journey-current">
          <span className="journey-current-dot" />
          <Box>
            <Typography className="impact-overview-label">UP NEXT</Typography>
            <Typography className="journey-current-title">
              {milestones.find((milestone) => milestone.key === currentKey)?.label || "Choose your first step"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="section-heading-row">
        <Box>
          <Typography variant="h2" className="section-title">Milestones</Typography>
          <Typography className="section-caption">Mark each step as you make progress. You can change it any time.</Typography>
        </Box>
      </Box>

      {loading ? (
        <Box className="loading-state"><CircularProgress size={25} /></Box>
      ) : (
        <Stack className="milestone-list" spacing={0}>
          {milestones.map((milestone, index) => {
            const definition = CAREER_MILESTONES.find((item) => item.id === milestone.key);
            const isCurrent = !milestone.completed && milestone.key === currentKey;
            return (
              <Paper key={milestone.key} className={`milestone-row${milestone.completed ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`} elevation={0}>
                <Box className="milestone-timeline">
                  <span className="milestone-index">{milestone.completed ? <CheckRoundedIcon /> : String(index + 1).padStart(2, "0")}</span>
                  {index < milestones.length - 1 && <span className={`milestone-connector${milestone.completed ? " is-complete" : ""}`} />}
                </Box>
                <Box className="milestone-copy">
                  <Typography variant="subtitle1">{milestone.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{definition?.description || "A step in your career journey"}</Typography>
                </Box>
                <Button
                  className="milestone-action"
                  size="small"
                  variant={milestone.completed ? "text" : isCurrent ? "contained" : "outlined"}
                  startIcon={milestone.completed ? <CheckRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
                  onClick={() => void toggleMilestone(milestone.key)}
                  disabled={Boolean(savingKey)}
                >
                  {savingKey === milestone.key ? <CircularProgress size={16} /> : milestone.completed ? "Complete" : isCurrent ? "Mark done" : "Mark done"}
                </Button>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}