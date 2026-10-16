"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Loading from "@/components/common/Loading";
import HRAccess from "../_components/HRAccess";
import AdminUserPreview from "@/app/admin/users/_components/AdminUserPreview";
import { getRequestErrorMessage } from "@/services/api";
import { getAdminDashboardStats, getAdminUsers, getUserInteractionSummaries } from "@/services/admin.service";
import type { AdminStats, User } from "@/types/api";

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
      getUserInteractionSummaries(),
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
      .catch((requestError: unknown) => {
        if (active) setError(getRequestErrorMessage(requestError, "Candidates could not be loaded. Please try again."));
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
    return candidates.filter((candidate) => [candidate.name, candidate.email, candidate.currentRole, candidate.company, ...(candidate.skills || [])]
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
    <Stack spacing={3} className="hr-candidate-page">
      <Box className="hr-candidate-heading">
        <Box>
          <Typography className="page-eyebrow">HR WORKSPACE</Typography>
          <Typography variant="h1" className="page-title">Candidates</Typography>
          <Typography className="page-subtitle">Explore candidate profiles and connect through their shared activity.</Typography>
        </Box>
        <Button className="hr-candidate-refresh" variant="outlined" startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />} onClick={refresh} disabled={refreshing}>Refresh</Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Box className="hr-candidate-toolbar">
        <Box>
          <Typography className="hr-candidate-count"><strong>{stats?.totalUsers ?? candidates.length}</strong> candidates</Typography>
          <Typography className="hr-candidate-result-count">
            {query.trim() ? `${visibleCandidates.length} matching profiles` : "Browse the candidate community"}
          </Typography>
        </Box>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search candidates"
          size="small"
          className="hr-candidate-search"
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
        />
      </Box>

      {loading ? <Box className="admin-loading"><Loading message="Loading candidates..." /></Box> : visibleCandidates.length ? (
        <Box className="hr-candidate-list">
          {visibleCandidates.map((candidate) => (
            <Paper key={candidate._id} className="hr-candidate-card" elevation={0}>
              <Button className="hr-candidate-main" onClick={() => setSelected(candidate)}>
                <Avatar className="hr-candidate-avatar">{candidate.name?.charAt(0).toUpperCase() || "U"}</Avatar>
                <span className="hr-candidate-copy">
                  <strong>{candidate.name}</strong>
                  <small className="hr-candidate-role">{[candidate.currentRole, candidate.company].filter(Boolean).join(" at ") || candidate.roles?.[0] || "USER"}</small>
                  <small className="hr-candidate-email">{candidate.email}</small>
                </span>
                <ArrowForwardRoundedIcon className="hr-candidate-arrow" />
              </Button>
              <Box className="hr-candidate-meta">
                <Box className="hr-candidate-facts">
                  <Typography variant="caption">Joined {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "-"}</Typography>
                </Box>
                {candidate.skills?.length ? <Box className="hr-candidate-skills">{candidate.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}{candidate.skills.length > 4 && <small>+{candidate.skills.length - 4}</small>}</Box> : null}
                {candidate.jobDescription && <Typography className="hr-candidate-description">{candidate.jobDescription}</Typography>}
                <Typography className="hr-candidate-interactions">{candidate.likeCount} likes <span aria-hidden="true">·</span> {candidate.commentCount} comments</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper className="hr-candidate-empty" elevation={0}>
          <span className="hr-candidate-empty-icon"><PeopleAltRoundedIcon /></span>
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
