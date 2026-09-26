"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
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
    <Stack spacing={3}>
      <Box className="admin-page-heading">
        <Box>
          <Typography className="page-eyebrow">HR WORKSPACE</Typography>
          <Typography variant="h1" className="page-title">HR dashboard</Typography>
          <Typography className="page-subtitle">Welcome back, {user.name?.split(" ")[0] || "HR"}. Follow candidate activity and explore profiles.</Typography>
        </Box>
        <Stack className="admin-heading-actions">
          <Button variant="outlined" startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />} onClick={refresh} disabled={refreshing}>Refresh</Button>
          <Button component={Link} href="/hr/candidates" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>View candidates</Button>
        </Stack>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      {loading ? <Box className="admin-loading"><CircularProgress size={26} /></Box> : <>
        <Box className="admin-stat-grid">
          <Paper className="admin-stat-panel" elevation={0}>
            <span className="admin-stat-icon"><PeopleAltRoundedIcon /></span>
            <Typography className="admin-stat-label">TOTAL CANDIDATES</Typography>
            <Typography className="admin-stat-value">{stats?.totalUsers ?? 0}</Typography>
            <Typography className="admin-stat-note">Profiles available to review</Typography>
          </Paper>
          <Paper className="admin-stat-panel" elevation={0}>
            <span className="admin-stat-icon admin-stat-icon-light"><PersonAddAlt1RoundedIcon /></span>
            <Typography className="admin-stat-label">NEW TODAY</Typography>
            <Typography className="admin-stat-value">{stats?.todayUsers ?? 0}</Typography>
            <Typography className="admin-stat-note">New candidate accounts today</Typography>
          </Paper>
        </Box>

        <Box className="admin-section">
          <Box className="admin-section-heading">
            <Box>
              <Typography className="admin-section-title">Recent activity</Typography>
              <Typography className="admin-section-note">Latest candidate profile updates</Typography>
            </Box>
            <Button component={Link} href="/hr/candidates" endIcon={<ArrowForwardRoundedIcon />}>Browse candidates</Button>
          </Box>
          <Paper className="admin-activity-panel" elevation={0}>
            {activity.length ? activity.slice(0, 10).map((item) => (
              <Box className="admin-activity-row" key={`${item._id}-${item.updatedAt}`}>
                <span className="admin-activity-dot" />
                <Box className="admin-activity-copy">
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="body2">Profile updated</Typography>
                  <Typography variant="caption">{item.email}</Typography>
                </Box>
                <Typography className="admin-activity-date">{new Date(item.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Typography>
              </Box>
            )) : <Typography className="admin-empty">No recent activity.</Typography>}
          </Paper>
        </Box>
      </>}
    </Stack>
  );
}

export default function HRDashboardPage() {
  return <HRAccess>{(user) => <HRDashboard user={user} />}</HRAccess>;
}
