"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Avatar, Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import HRAccess from "./_components/HRAccess";
import { getAdminDashboardStats, getRecentAdminActivity } from "@/services/admin.service";
import type { AdminStats, RecentActivity, User } from "@/types/api";

function HRDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminDashboardStats(), getRecentAdminActivity()])
      .then(([nextStats, nextActivity]) => {
        if (!active) return;
        setStats(nextStats);
        setActivity(nextActivity);
        setError("");
      })
      .catch(() => {
        if (active) setError("Candidate data could not be loaded.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      active = false;
    };
  }, [reload]);

  const refresh = () => {
    setRefreshing(true);
    setReload((value) => value + 1);
  };

  return (
    <Stack spacing={3} className="hr-dashboard">
      <Box className="hr-dashboard-heading">
        <Box className="hr-dashboard-welcome">
          <Typography className="page-eyebrow">HR WORKSPACE</Typography>
          <Typography variant="h1" className="page-title">Welcome back, {user.name?.split(" ")[0] || "HR"}</Typography>
          <Typography className="page-subtitle">Here’s what’s happening with your candidate community.</Typography>
        </Box>
        <Stack className="hr-dashboard-actions">
          <Button variant="outlined" startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />} onClick={refresh} disabled={refreshing}>Refresh</Button>
          <Button component={Link} href="/hr/candidates" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>Browse candidates</Button>
        </Stack>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      {loading ? <Box className="admin-loading"><CircularProgress size={26} /></Box> : <>
        <Box className="hr-dashboard-grid">
          <Box className="hr-dashboard-main">
            <Box className="hr-dashboard-stats">
              <Paper className="hr-dashboard-stat" elevation={0}>
                <span className="hr-dashboard-stat-icon"><PeopleAltRoundedIcon /></span>
                <Typography className="hr-dashboard-stat-label">TOTAL CANDIDATES</Typography>
                <Typography className="hr-dashboard-stat-value">{stats?.totalUsers ?? 0}</Typography>
                <Typography className="hr-dashboard-stat-note">Profiles available to review</Typography>
              </Paper>
              <Paper className="hr-dashboard-stat" elevation={0}>
                <span className="hr-dashboard-stat-icon is-soft"><PersonAddAlt1RoundedIcon /></span>
                <Typography className="hr-dashboard-stat-label">NEW TODAY</Typography>
                <Typography className="hr-dashboard-stat-value">{stats?.todayUsers ?? 0}</Typography>
                <Typography className="hr-dashboard-stat-note">New candidate accounts today</Typography>
              </Paper>
            </Box>

            <Box className="hr-dashboard-section">
              <Box className="hr-dashboard-section-heading">
                <Box>
                  <Typography className="hr-dashboard-section-title">Recent activity</Typography>
                  <Typography className="hr-dashboard-section-note">Latest candidate profile updates</Typography>
                </Box>
                <Button component={Link} href="/hr/candidates" endIcon={<ArrowForwardRoundedIcon />}>See all</Button>
              </Box>
              <Paper className="hr-dashboard-activity" elevation={0}>
                {activity.length ? activity.slice(0, 8).map((item) => (
                  <Box className="hr-dashboard-activity-row" key={`${item._id}-${item.updatedAt}`}>
                    <Avatar className="hr-dashboard-activity-avatar">{item.name?.charAt(0).toUpperCase() || "U"}</Avatar>
                    <Box className="hr-dashboard-activity-copy">
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="body2">Profile updated</Typography>
                      <Typography variant="caption">{item.email}</Typography>
                    </Box>
                    <Typography className="hr-dashboard-activity-date">{new Date(item.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Typography>
                  </Box>
                )) : <Typography className="hr-dashboard-empty">No recent activity.</Typography>}
              </Paper>
            </Box>
          </Box>

          <Stack className="hr-dashboard-side" spacing={2}>
            <Paper className="hr-dashboard-profile" elevation={0}>
              <Box className="hr-dashboard-profile-heading">
                <span className="hr-dashboard-side-icon"><PersonOutlineRoundedIcon /></span>
                <Typography className="hr-dashboard-profile-label">YOUR PROFILE</Typography>
              </Box>
              <Avatar className="hr-dashboard-profile-avatar">{user.name?.charAt(0).toUpperCase() || "H"}</Avatar>
              <Typography className="hr-dashboard-profile-name">{user.name}</Typography>
              <Typography className="hr-dashboard-profile-email">{user.email}</Typography>
              <Divider className="hr-dashboard-divider" />
              <Typography className="hr-dashboard-role-label">ACCOUNT ROLE</Typography>
              <Typography className="hr-dashboard-role">{user.roles?.find((role) => role === "HR") || "HR"}</Typography>
              <Button component={Link} href="/profile" className="hr-dashboard-profile-link" endIcon={<ArrowForwardRoundedIcon />}>View profile</Button>
            </Paper>

            <Paper className="hr-dashboard-directory" elevation={0}>
              <span className="hr-dashboard-directory-icon"><PeopleAltRoundedIcon /></span>
              <Typography className="hr-dashboard-directory-title">Candidate directory</Typography>
              <Typography className="hr-dashboard-directory-copy">Explore candidate profiles, skills, and shared activity.</Typography>
              <Button component={Link} href="/hr/candidates" variant="contained" fullWidth endIcon={<ArrowForwardRoundedIcon />}>View candidates</Button>
            </Paper>
          </Stack>
        </Box>
      </>}
    </Stack>
  );
}

export default function HRDashboardPage() {
  return <HRAccess>{(user) => <HRDashboard user={user} />}</HRAccess>;
}
