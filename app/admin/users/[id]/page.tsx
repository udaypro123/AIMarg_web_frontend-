"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import AdminAccess from "../../_components/AdminAccess";
import { getAdminUser } from "@/services/admin.service";
import type { User } from "@/types/api";

function safeExternalUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Box className="admin-detail-field">
      <Typography className="admin-detail-label">{label}</Typography>
      <Typography className="admin-detail-value">{value}</Typography>
    </Box>
  );
}

function AdminUserDetail({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminUser(userId)
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch(() => {
        if (active) setError("This user profile could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) return <Box className="admin-loading"><CircularProgress size={26} /></Box>;
  if (error || !profile) return <Alert severity="error">{error || "User not found."}</Alert>;

  const linkedinUrl = safeExternalUrl(profile.linkedinUrl);
  const githubUrl = safeExternalUrl(profile.githubUrl);

  return (
    <Stack spacing={3}>
      <Box className="admin-page-heading">
        <Box>
          <Typography className="page-eyebrow">ADMINISTRATION / USER PROFILE</Typography>
          <Typography variant="h1" className="page-title">User details</Typography>
        </Box>
        <Button component={Link} href="/admin/users" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>Back to users</Button>
      </Box>

      <Paper className="admin-user-profile-header" elevation={0}>
        <Avatar className="admin-profile-avatar">{profile.name?.charAt(0).toUpperCase() || "U"}</Avatar>
        <Box className="admin-profile-identity">
          <Typography variant="h2">{profile.name}</Typography>
          <Typography>{profile.email}</Typography>
          <Box className="admin-profile-badges">
            <Chip size="small" label={profile.roles?.[0] || "USER"} className="admin-role-pill" />
            <Chip size="small" label={profile.isBlocked ? "Blocked" : "Active"} className={profile.isBlocked ? "admin-status-chip is-blocked" : "admin-status-chip"} />
          </Box>
        </Box>
        <Typography className="admin-joined-date">Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</Typography>
      </Paper>

      <Box className="admin-detail-grid">
        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Contact information</Typography>
          <Stack spacing={2}>
            <DetailField label="Email" value={profile.email} />
            <DetailField label="Mobile" value={profile.mobile} />
            <DetailField label="Country" value={profile.country} />
          </Stack>
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Professional details</Typography>
          <Box className="admin-detail-fields-grid">
            <DetailField label="Current role" value={profile.currentRole} />
            <DetailField label="Company" value={profile.company} />
            <DetailField label="Previous role" value={profile.previousRole} />
            <DetailField label="Previous company" value={profile.previousCompany} />
            <DetailField label="Profession" value={profile.profession} />
            <DetailField label="Industry" value={profile.industry} />
            <DetailField label="Employment status" value={profile.employmentStatus} />
            <DetailField label="Experience" value={profile.experience} />
          </Box>
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Job description</Typography>
          <Typography className={profile.jobDescription ? "admin-detail-paragraph" : "admin-no-data"}>
            {profile.jobDescription || "No job description provided."}
          </Typography>
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Skills</Typography>
          {profile.skills?.length ? (
            <Box className="admin-skill-list">{profile.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}</Box>
          ) : <Typography className="admin-no-data">No skills listed.</Typography>}
        </Paper>

        <Paper className="admin-detail-section" elevation={0}>
          <Typography className="admin-section-title">Online profiles</Typography>
          <Box className="admin-profile-links">
            {linkedinUrl && <Button component="a" href={linkedinUrl} target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<LaunchRoundedIcon />}>LinkedIn</Button>}
            {githubUrl && <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<LaunchRoundedIcon />}>GitHub</Button>}
            {!linkedinUrl && !githubUrl && <Typography className="admin-no-data">No public profiles listed.</Typography>}
          </Box>
        </Paper>

        {profile.resume && (
          <Paper className="admin-detail-section admin-resume-note" elevation={0}>
            <Typography className="admin-section-title">Resume</Typography>
            <Typography className="admin-detail-paragraph">A resume is on file. It is stored privately and is not available through a public link.</Typography>
          </Paper>
        )}
      </Box>
    </Stack>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  return <AdminAccess>{() => <AdminUserDetail userId={userId} />}</AdminAccess>;
}
