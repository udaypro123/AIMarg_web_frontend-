"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { getCareerJourney } from "@/services/career.service";
import { getMyPosts } from "@/services/community.service";
import { getMyImpactReports } from "@/services/impact.service";
import { getProfile } from "@/services/user.service";
import type { CareerJourney, ImpactReport, Post, User } from "@/types/api";

export default function HomePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [latestReport, setLatestReport] = useState<ImpactReport | null>(null);
  const [journey, setJourney] = useState<CareerJourney | null>(null);
  const [myThought, setMyThought] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([getProfile(), getMyImpactReports(), getCareerJourney(), getMyPosts()]).then((results) => {
      if (!active) return;
      if (results[0].status === "fulfilled") setProfile(results[0].value);
      if (results[1].status === "fulfilled") setLatestReport(results[1].value[0] || null);
      if (results[2].status === "fulfilled") setJourney(results[2].value);
      if (results[3].status === "fulfilled") setMyThought(results[3].value[0] || null);
      if (results.every((result) => result.status === "rejected")) setError("We could not refresh your workspace data.");
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const firstName = profile?.name?.split(" ")[0] || "there";
  const milestones = journey?.milestones || [];
  const completedMilestones = milestones.filter((milestone) => milestone.completed).length;
  const nextMilestone = milestones.find((milestone) => !milestone.completed);
  const profileFields = [profile?.currentRole, profile?.company, profile?.employmentStatus, profile?.skills?.length ? "skills" : "", profile?.careerGoal];
  const profileProgress = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);
  const profileComplete = Boolean(profile?.currentRole && profile.company && profile.skills?.length && profile.mobile);
  const resumeName = profile?.resume?.split("/").pop();

  return (
    <Stack spacing={3}>
      <Box className="dashboard-heading">
        <Box>
          <Typography className="page-eyebrow">YOUR CAREER OVERVIEW</Typography>
          <Typography variant="h1" className="page-title">Welcome, {firstName}</Typography>
          <Typography className="page-subtitle">A clearer view of how work is changing for you.</Typography>
        </Box>
        <Button component={Link} href={profileComplete ? "/impact" : "/profile"} variant="contained" endIcon={<ArrowForwardRoundedIcon />}>
          {profileComplete ? "Check in on AI impact" : "Complete profile to add impact"}
        </Button>
      </Box>

      {error && <Alert severity="warning" onClose={() => setError("")}>{error}</Alert>}

      <Box className="dashboard-hero">
        <Box className="dashboard-hero-copy">
          <Typography className="dashboard-hero-kicker"><span /> CAREER MOMENTUM</Typography>
          <Typography variant="h2">Make your next move a considered one.</Typography>
          <Typography>Track the signals, strengthen your toolkit, and choose a next step that works for you.</Typography>
          <Button component={Link} href={nextMilestone ? "/career" : profileComplete ? "/impact" : "/profile"} endIcon={<ArrowForwardRoundedIcon />}>
            {nextMilestone ? `Continue: ${nextMilestone.label}` : profileComplete ? "Start with an impact check-in" : "Complete your profile first"}
          </Button>
        </Box>
        <Box className="dashboard-hero-path" aria-label="Career journey overview">
          <span className="hero-path-step is-done"><strong>01</strong><span>Check in</span><i /></span>
          <span className="hero-path-step is-next"><strong>02</strong><span>Build skills</span><i /></span>
          <span className="hero-path-step"><strong>03</strong><span>Choose what is next</span></span>
        </Box>
      </Box>

      <Box className="dashboard-metrics">
        <Paper className="dashboard-metric" elevation={0}>
          <span className="metric-icon metric-icon-blue"><TrendingUpRoundedIcon /></span>
          <Typography className="metric-label">AI IMPACT</Typography>
          <Typography className="metric-value">{loading ? "—" : latestReport?.impactStatus || "Not assessed"}</Typography>
          <Typography className="metric-footnote">{latestReport ? new Date(latestReport.createdAt).toLocaleDateString() : "Your latest check-in"}</Typography>
          <Link href="/impact" className="metric-link">View reports <ArrowForwardRoundedIcon /></Link>
        </Paper>
        <Paper className="dashboard-metric" elevation={0}>
          <span className="metric-icon metric-icon-blue"><RouteRoundedIcon /></span>
          <Typography className="metric-label">CAREER JOURNEY</Typography>
          <Typography className="metric-value">{loading ? "—" : `${completedMilestones} / ${milestones.length}`}</Typography>
          <Typography className="metric-footnote">Milestones completed</Typography>
          <Link href="/career" className="metric-link">View journey <ArrowForwardRoundedIcon /></Link>
        </Paper>
        <Paper className="dashboard-metric" elevation={0}>
          <span className="metric-icon metric-icon-blue-light"><SchoolRoundedIcon /></span>
          <Typography className="metric-label">YOUR SKILLS</Typography>
          <Typography className="metric-value">{loading ? "—" : profile?.skills?.length || 0}</Typography>
          <Typography className="metric-footnote">Skills in your profile</Typography>
          <Link href="/skills" className="metric-link">Manage skills <ArrowForwardRoundedIcon /></Link>
        </Paper>
      </Box>

      <Box className="dashboard-lower-grid">
        <Box className="dashboard-next-step">
          <Box className="section-heading-row">
            <Box>
              <Typography className="impact-overview-label">KEEP MOVING</Typography>
              <Typography variant="h2" className="section-title">Your next step</Typography>
            </Box>
            <span className="next-step-mark"><RouteRoundedIcon /></span>
          </Box>
          <Typography className="next-step-title">{loading ? "Loading your journey" : nextMilestone?.label || "Your journey is up to date"}</Typography>
          <Typography className="next-step-copy">
            {nextMilestone ? "Pick up where you left off. Mark milestones as you make progress." : "Add a career milestone or update your impact check-in to keep your plan current."}
          </Typography>
          {milestones.length > 0 && <LinearProgress variant="determinate" value={Math.round((completedMilestones / milestones.length) * 100)} />}
          <Button component={Link} href="/career" endIcon={<ArrowForwardRoundedIcon />}>Open career path</Button>
        </Box>

        <Box className="dashboard-profile-card">
          <Box>
            <Typography className="impact-overview-label">PROFILE COMPLETENESS</Typography>
            <Typography className="profile-progress-number">{profileProgress}%</Typography>
            <Typography className="section-caption">A few details can make your career picture clearer.</Typography>
          </Box>
          <div className="profile-progress-track"><span style={{ width: `${profileProgress}%` }} /></div>
          <Box className="dashboard-resume-status">
            <DescriptionOutlinedIcon />
            <span>{resumeName ? `Resume attached: ${resumeName}` : "No resume attached"}</span>
          </Box>
          <Button component={Link} href="/profile" variant="outlined" endIcon={<ArrowForwardRoundedIcon />}>Complete your profile</Button>
        </Box>
      </Box>

      <Paper className="dashboard-thought-panel" elevation={0}>
        <Box className="dashboard-thought-copy">
          <Typography className="impact-overview-label">YOUR COMMUNITY VOICE</Typography>
          <Typography variant="h2" className="section-title">My AI impact thought</Typography>
          {myThought ? (
            <>
              <Typography className="dashboard-thought-title">{myThought.title}</Typography>
              <Typography className="dashboard-thought-content">{myThought.content}</Typography>
            </>
          ) : (
            <Typography className="section-caption">You have not shared your perspective yet.</Typography>
          )}
        </Box>
        <Button component={Link} href="/community" variant={myThought ? "outlined" : "contained"} endIcon={<ArrowForwardRoundedIcon />}>
          {myThought ? "View or edit thought" : "Share your thought"}
        </Button>
      </Paper>

      <Box className="dashboard-quick-links">
        <Typography className="impact-overview-label">YOUR WORKSPACE</Typography>
        <Box className="quick-link-grid">
          <Link href="/impact"><InsightsRoundedIcon /><span><strong>Impact reports</strong><small>Track how work is changing</small></span><ArrowForwardRoundedIcon /></Link>
          <Link href="/skills"><SchoolRoundedIcon /><span><strong>Skill library</strong><small>Keep your strengths current</small></span><ArrowForwardRoundedIcon /></Link>
          <Link href="/community"><AutoAwesomeRoundedIcon /><span><strong>Community</strong><small>Learn from other professionals</small></span><ArrowForwardRoundedIcon /></Link>
        </Box>
      </Box>
    </Stack>
  );
}
