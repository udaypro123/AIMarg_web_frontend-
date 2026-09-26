"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { downloadResume, getProfile, updateProfile, uploadResume } from "@/services/user.service";
import type { User } from "@/types/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [initialProfile, setInitialProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setInitialProfile(data);
      })
      .catch(() => {
        if (active) setError("Your profile could not be loaded. Please refresh and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof User, value: string) => {
    setSaved(false);
    setProfile((current) => current ? { ...current, [field]: value } : current);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateProfile({
        name: profile.name,
        country: profile.country,
        profession: profile.profession,
        industry: profile.industry,
        experience: profile.experience,
        employmentStatus: profile.employmentStatus,
        skills: profile.skills || [],
        careerGoal: profile.careerGoal,
        aiUsage: profile.aiUsage,
        mobile: profile.mobile,
        currentRole: profile.currentRole,
        previousRole: profile.previousRole,
        previousCompany: profile.previousCompany,
        company: profile.company,
        jobDescription: profile.jobDescription,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
      });
      setProfile(updated);
      setInitialProfile(updated);
      setSaved(true);
    } catch {
      setError("Your changes could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const resume = await uploadResume(file);
      setProfile((current) => current ? { ...current, resume } : current);
    } catch {
      setError("Resume upload failed. Use a PDF or Word document and try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      const blob = await downloadResume();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = profile?.resume?.split("/").pop() || "AIMarg-resume";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Your resume could not be downloaded.");
    } finally {
      setDownloading(false);
    }
  };

  const hasChanges = Boolean(profile && initialProfile && JSON.stringify(profile) !== JSON.stringify(initialProfile));

  return (
    <Stack spacing={3}>
      <Box className="page-heading-row">
        <Box>
          <Typography className="page-eyebrow">ACCOUNT DETAILS</Typography>
          <Typography variant="h1" className="page-title">Your profile</Typography>
          <Typography className="page-subtitle">Keep your career details and contact information up to date.</Typography>
        </Box>
        {profile && <Avatar className="profile-large-avatar">{profile.name?.charAt(0).toUpperCase() || "U"}</Avatar>}
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {loading ? <Box className="loading-state"><CircularProgress size={25} /></Box> : profile && (
        <>
          <Box className="profile-layout">
            <Stack spacing={2.5}>
              <Paper className="profile-section" elevation={0}>
                <Box className="section-heading-row">
                  <Box>
                    <Typography className="impact-overview-label">BASICS</Typography>
                    <Typography variant="h2" className="section-title">Personal details</Typography>
                  </Box>
                </Box>
                <Box className="profile-form-grid">
                  <TextField label="Full name" value={profile.name || ""} onChange={(event) => updateField("name", event.target.value)} fullWidth />
                  <TextField label="Email address" value={profile.email || ""} disabled fullWidth helperText="Email address is managed by your sign-in settings." />
                  <TextField label="Phone number" value={profile.mobile || ""} onChange={(event) => updateField("mobile", event.target.value)} fullWidth />
                  <TextField label="Country" value={profile.country || ""} onChange={(event) => updateField("country", event.target.value)} fullWidth />
                </Box>
              </Paper>

              <Paper className="profile-section" elevation={0}>
                <Box className="section-heading-row">
                  <Box>
                    <Typography className="impact-overview-label">CAREER</Typography>
                    <Typography variant="h2" className="section-title">Professional details</Typography>
                  </Box>
                </Box>
                <Box className="profile-form-grid">
                  <TextField label="Current role" value={profile.currentRole || ""} onChange={(event) => updateField("currentRole", event.target.value)} fullWidth />
                  <TextField label="Company" value={profile.company || ""} onChange={(event) => updateField("company", event.target.value)} fullWidth />
                  <TextField label="Profession" value={profile.profession || ""} onChange={(event) => updateField("profession", event.target.value)} fullWidth />
                  <TextField label="Industry" value={profile.industry || ""} onChange={(event) => updateField("industry", event.target.value)} fullWidth />
                  <TextField label="Experience" value={profile.experience || ""} onChange={(event) => updateField("experience", event.target.value)} fullWidth />
                  <TextField label="Employment status" value={profile.employmentStatus || ""} onChange={(event) => updateField("employmentStatus", event.target.value)} fullWidth />
                  <TextField label="Previous role" value={profile.previousRole || ""} onChange={(event) => updateField("previousRole", event.target.value)} fullWidth />
                  <TextField label="Previous company" value={profile.previousCompany || ""} onChange={(event) => updateField("previousCompany", event.target.value)} fullWidth />
                  <TextField label="Career goal" value={profile.careerGoal || ""} onChange={(event) => updateField("careerGoal", event.target.value)} fullWidth />
                  <TextField label="How you use AI" value={profile.aiUsage || ""} onChange={(event) => updateField("aiUsage", event.target.value)} fullWidth />
                  <TextField label="LinkedIn URL" value={profile.linkedinUrl || ""} onChange={(event) => updateField("linkedinUrl", event.target.value)} fullWidth />
                  <TextField label="GitHub URL" value={profile.githubUrl || ""} onChange={(event) => updateField("githubUrl", event.target.value)} fullWidth />
                  <TextField label="Role description" value={profile.jobDescription || ""} onChange={(event) => updateField("jobDescription", event.target.value)} multiline minRows={3} className="profile-description-field" fullWidth />
                </Box>
              </Paper>
            </Stack>

            <Stack spacing={2.5}>
              <Paper className="resume-panel" elevation={0}>
                <span className="resume-icon"><UploadFileRoundedIcon /></span>
                <Typography variant="h3">Resume</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.resume ? profile.resume.split("/").pop() : "Add a resume to keep your career profile in one place."}
                </Typography>
                <input ref={fileInput} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onChange={(event) => void handleUpload(event.target.files?.[0])} />
                <Button variant="contained" startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <UploadFileRoundedIcon />} onClick={() => fileInput.current?.click()} disabled={uploading} fullWidth>
                  {uploading ? "Uploading" : profile.resume ? "Replace resume" : "Upload resume"}
                </Button>
                {profile.resume && <Button variant="text" startIcon={downloading ? <CircularProgress size={16} /> : <DownloadRoundedIcon />} onClick={() => void handleDownload()} disabled={downloading} fullWidth>Download current</Button>}
              </Paper>
              <Paper className="privacy-note" elevation={0}>
                <Typography className="impact-overview-label">YOUR DATA, YOURS</Typography>
                <Typography variant="subtitle1">Career details stay in your account</Typography>
                <Typography variant="body2">Your impact reports are private. Only profile details you choose to share appear in the community.</Typography>
              </Paper>
            </Stack>
          </Box>

          <Divider />
          <Box className="profile-save-bar">
            <Typography variant="body2" color="text.secondary">
              {saved ? <><CheckRoundedIcon fontSize="small" /> Changes saved</> : hasChanges ? "You have unsaved changes" : "All changes are up to date"}
            </Typography>
            <Button variant="contained" onClick={() => void saveProfile()} disabled={!hasChanges || saving}>
              {saving ? <CircularProgress size={18} color="inherit" /> : "Save profile"}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
}