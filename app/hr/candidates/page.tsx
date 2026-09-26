"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HRAccess from "../_components/HRAccess";
import AdminUserPreview from "@/app/admin/users/_components/AdminUserPreview";
import { getAdminDashboardStats, getAdminUsers, getUserInteractionSummaries } from "@/services/admin.service";
import type { AdminStats, User, UserInteractionSummary } from "@/types/api";

type Candidate = User & { likeCount: number; commentCount: number; likedByMe: boolean };

function CandidateDirectory({ user }: { user: User }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      getAdminDashboardStats(),
      getAdminUsers(),
      getUserInteractionSummaries().catch((): UserInteractionSummary[] => []),
    ])
      .then(([nextStats, users, interactions]) => {
        if (!active) return;
        const byUserId = new Map(interactions.map((interaction) => [interaction.targetUserId, interaction]));
        setStats(nextStats);
        setCandidates(users
          .filter((candidate) => candidate._id !== user._id && !candidate.roles?.includes("ADMIN") && !candidate.roles?.includes("SUPER_ADMIN"))
          .map((candidate) => {
            const interaction = byUserId.get(candidate._id || "");
            return {
              ...candidate,
              likeCount: interaction?.likeCount ?? 0,
              commentCount: interaction?.commentCount ?? 0,
              likedByMe: interaction?.likedByMe ?? false,
            };
          }));
        setError("");
      })
      .catch(() => {
        if (active) setError("Candidates could not be loaded. Please try again.");
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
  }, [reload, user._id]);

  const visibleCandidates = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter((candidate) => [candidate.name, candidate.email, candidate.currentRole, candidate.company, candidate.profession, ...(candidate.skills || [])]
      .some((value) => value?.toLowerCase().includes(term)));
  }, [candidates, query]);

  const refresh = () => {
    setRefreshing(true);
    setReload((current) => current + 1);
  };

  const applyInteractionChange = (userId: string, interaction: Pick<Candidate, "likeCount" | "commentCount" | "likedByMe">) => {
    setCandidates((current) => current.map((candidate) => candidate._id === userId ? { ...candidate, ...interaction } : candidate));
    setSelected((current) => current?._id === userId ? { ...current, ...interaction } : current);
  };

  return (
    <Stack spacing={3}>
      <Box className="admin-page-heading">
        <Box>
          <Typography className="page-eyebrow">HR WORKSPACE</Typography>
          <Typography variant="h1" className="page-title">Candidates</Typography>
          <Typography className="page-subtitle">Explore candidate profiles and connect through their shared activity.</Typography>
        </Box>
        <Button variant="outlined" startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />} onClick={refresh} disabled={refreshing}>Refresh</Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Box className="admin-users-toolbar">
        <Typography className="admin-users-count"><strong>{stats?.totalUsers ?? candidates.length}</strong> candidates</Typography>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search candidates"
          size="small"
          className="admin-search"
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
        />
      </Box>

      {loading ? <Box className="admin-loading"><CircularProgress size={26} /></Box> : visibleCandidates.length ? (
        <Stack className="admin-candidate-list" spacing={1.25}>
          {visibleCandidates.map((candidate) => (
            <Paper key={candidate._id} className="admin-candidate-card" elevation={0}>
              <Button className="admin-candidate-main" onClick={() => setSelected(candidate)}>
                <Avatar className="admin-avatar">{candidate.name?.charAt(0).toUpperCase() || "U"}</Avatar>
                <span className="admin-user-copy">
                  <strong>{candidate.name}</strong>
                  <small>{[candidate.currentRole, candidate.company].filter(Boolean).join(" at ") || candidate.roles?.[0] || "USER"}</small>
                  <small>{candidate.email}</small>
                </span>
                <ArrowForwardRoundedIcon className="admin-row-arrow" />
              </Button>
              <Box className="admin-candidate-meta">
                <Box className="admin-candidate-facts">
                  {candidate.mobile && <Typography variant="caption">{candidate.mobile}</Typography>}
                  {candidate.profession && <Typography variant="caption">{candidate.profession}</Typography>}
                  <Typography variant="caption">Joined {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "-"}</Typography>
                </Box>
                {candidate.skills?.length ? <Box className="admin-skill-list">{candidate.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}{candidate.skills.length > 4 && <small>+{candidate.skills.length - 4}</small>}</Box> : null}
                {candidate.jobDescription && <Typography className="admin-candidate-description">{candidate.jobDescription}</Typography>}
                <Typography className="admin-candidate-interactions">{candidate.likeCount} likes · {candidate.commentCount} comments</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Paper className="admin-empty-panel" elevation={0}>
          <Typography variant="h3">{candidates.length ? "No matching candidates" : "No candidates yet"}</Typography>
          <Typography variant="body2">{candidates.length ? "Try another name, role, or skill." : "Candidate profiles will appear here."}</Typography>
        </Paper>
      )}

      {selected && <AdminUserPreview user={selected} open onClose={() => setSelected(null)} onInteractionChange={applyInteractionChange} />}
    </Stack>
  );
}

export default function HRCandidatesPage() {
  return <HRAccess>{(user) => <CandidateDirectory user={user} />}</HRAccess>;
}
