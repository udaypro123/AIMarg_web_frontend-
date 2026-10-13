"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { deleteMyAccount, downloadResume, getProfile, updateProfile, uploadResume } from "@/services/user.service";
import { setAccessToken } from "@/services/api";
import type { User } from "@/types/api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [initialProfile, setInitialProfile] = useState<User | null>(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setInitialProfile(data);
        setSkillsInput((data.skills || []).join(", "));
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
    const requiredFields: Array<[string, string | undefined]> = [
      ["Full name", profile.name],
      ["Country", profile.country],
      ["Experience", profile.experience],
      ["Current role", profile.currentRole],
      ["Previous role", profile.previousRole],
      ["Previous company", profile.previousCompany],
      ["Company", profile.company],
      ["Job description", profile.jobDescription],
      ["LinkedIn URL", profile.linkedinUrl],
      ["GitHub URL", profile.githubUrl],
      ["Resume", profile.resume],
    ];
    const missingFields = requiredFields
      .filter(([, value]) => !value?.trim())
      .map(([label]) => label);
    const skills = skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean);
    if (skills.length === 0) missingFields.push("Skills");
    if (missingFields.length > 0) {
      setError(`Complete all required fields: ${missingFields.join(", ")}.`);
      return;
    }
    const invalidUrls = [
      ["LinkedIn URL", profile.linkedinUrl],
      ["GitHub URL", profile.githubUrl],
    ].filter(([, value]) => {
      try {
        const url = new URL(value!);
        return url.protocol !== "https:" && url.protocol !== "http:";
      } catch {
        return true;
      }
    }).map(([label]) => label);
    if (invalidUrls.length > 0) {
      setError(`Enter a valid HTTP or HTTPS URL for: ${invalidUrls.join(", ")}.`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateProfile({
        name: profile.name,
        country: profile.country,
        experience: profile.experience,
        skills,
        aiUsage: profile.aiUsage,
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
      setSkillsInput((updated.skills || []).join(", "));
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

  const saveAccountSettings = async () => {
    if (!profile) return;
    setSettingsSaving(true);
    setError("");
    try {
      const updated = await updateProfile({
        privacySettings: {
          profileDiscoverable: profile.privacySettings?.profileDiscoverable ?? true,
        },
        notificationPreferences: {
          email: profile.notificationPreferences?.email ?? true,
          sms: profile.notificationPreferences?.sms ?? false,
          whatsapp: profile.notificationPreferences?.whatsapp ?? false,
        },
      });
      setProfile((current) => current ? {
        ...current,
        privacySettings: updated.privacySettings,
        notificationPreferences: updated.notificationPreferences,
      } : updated);
      setInitialProfile((current) => current ? {
        ...current,
        privacySettings: updated.privacySettings,
        notificationPreferences: updated.notificationPreferences,
      } : updated);
    } catch {
      setError("Your privacy and notification settings could not be saved. Please try again.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return;
    setDeletingAccount(true);
    setError("");
    try {
      await deleteMyAccount();
      setAccessToken(null);
      router.replace("/auth/login");
    } catch {
      setError("Your account could not be deleted. Please try again.");
      setDeletingAccount(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmation("");
    }
  };

  const hasChanges = Boolean(profile && initialProfile && JSON.stringify({
    ...profile,
    privacySettings: undefined,
    notificationPreferences: undefined,
  }) !== JSON.stringify({
    ...initialProfile,
    privacySettings: undefined,
    notificationPreferences: undefined,
  }));
  const hasAccountSettingsChanges = Boolean(profile && initialProfile && (
    (profile.privacySettings?.profileDiscoverable ?? true) !== (initialProfile.privacySettings?.profileDiscoverable ?? true) ||
    (profile.notificationPreferences?.email ?? true) !== (initialProfile.notificationPreferences?.email ?? true) ||
    (profile.notificationPreferences?.sms ?? false) !== (initialProfile.notificationPreferences?.sms ?? false) ||
    (profile.notificationPreferences?.whatsapp ?? false) !== (initialProfile.notificationPreferences?.whatsapp ?? false)
  ));
  const hasSkillsChanges = Boolean(initialProfile && skillsInput !== (initialProfile.skills || []).join(", "));

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
                  <TextField label="Full name" value={profile.name || ""} onChange={(event) => updateField("name", event.target.value)} required fullWidth />
                  <TextField label="Email address" value={profile.email || ""} disabled required fullWidth helperText="Email address is managed by your sign-in settings." />
                  <TextField label="Country" value={profile.country || ""} onChange={(event) => updateField("country", event.target.value)} required fullWidth />
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
                  <TextField label="Current role" value={profile.currentRole || ""} onChange={(event) => updateField("currentRole", event.target.value)} required fullWidth />
                  <TextField label="Company" value={profile.company || ""} onChange={(event) => updateField("company", event.target.value)} required fullWidth />
                  <TextField label="Experience" value={profile.experience || ""} onChange={(event) => updateField("experience", event.target.value)} required fullWidth />
                  <TextField label="Previous role" value={profile.previousRole || ""} onChange={(event) => updateField("previousRole", event.target.value)} required fullWidth />
                  <TextField label="Previous company" value={profile.previousCompany || ""} onChange={(event) => updateField("previousCompany", event.target.value)} required fullWidth />
                  <TextField label="How you use AI" value={profile.aiUsage || ""} onChange={(event) => updateField("aiUsage", event.target.value)} fullWidth />
                  <TextField label="Skills (comma separated)" value={skillsInput} onChange={(event) => {
                    setSaved(false);
                    setSkillsInput(event.target.value);
                  }} required fullWidth />
                  <TextField label="LinkedIn URL" value={profile.linkedinUrl || ""} onChange={(event) => updateField("linkedinUrl", event.target.value)} required fullWidth />
                  <TextField label="GitHub URL" value={profile.githubUrl || ""} onChange={(event) => updateField("githubUrl", event.target.value)} required fullWidth />
                  <TextField label="Role description" value={profile.jobDescription || ""} onChange={(event) => updateField("jobDescription", event.target.value)} required multiline minRows={3} className="profile-description-field" fullWidth />
                </Box>
              </Paper>
            </Stack>

            <Stack spacing={2.5}>
              <Paper className="resume-panel" elevation={0}>
                <span className="resume-icon"><UploadFileRoundedIcon /></span>
                <Typography variant="h3">
                  Resume <Box component="span" sx={{ color: "error.main" }}>*</Box>
                </Typography>
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
              <Paper className="profile-section" elevation={0}>
                <Typography className="impact-overview-label">PRIVACY & NOTIFICATIONS</Typography>
                <Typography variant="h2" className="section-title">Account preferences</Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.privacySettings?.profileDiscoverable ?? true}
                        onChange={(event) => setProfile((current) => current ? {
                          ...current,
                          privacySettings: { profileDiscoverable: event.target.checked },
                        } : current)}
                      />
                    }
                    label="Make my profile discoverable to the community"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notificationPreferences?.email ?? true}
                        onChange={(event) => setProfile((current) => current ? {
                          ...current,
                          notificationPreferences: {
                            email: event.target.checked,
                            sms: current.notificationPreferences?.sms ?? false,
                            whatsapp: current.notificationPreferences?.whatsapp ?? false,
                          },
                        } : current)}
                      />
                    }
                    label="Email notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notificationPreferences?.sms ?? false}
                        onChange={(event) => setProfile((current) => current ? {
                          ...current,
                          notificationPreferences: {
                            email: current.notificationPreferences?.email ?? true,
                            sms: event.target.checked,
                            whatsapp: current.notificationPreferences?.whatsapp ?? false,
                          },
                        } : current)}
                      />
                    }
                    label="SMS notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notificationPreferences?.whatsapp ?? false}
                        onChange={(event) => setProfile((current) => current ? {
                          ...current,
                          notificationPreferences: {
                            email: current.notificationPreferences?.email ?? true,
                            sms: current.notificationPreferences?.sms ?? false,
                            whatsapp: event.target.checked,
                          },
                        } : current)}
                      />
                    }
                    label="WhatsApp notifications"
                  />
                </Stack>
                <Button
                  variant="contained"
                  onClick={() => void saveAccountSettings()}
                  disabled={settingsSaving || !hasAccountSettingsChanges}
                  sx={{ mt: 1 }}
                >
                  {settingsSaving ? <CircularProgress size={18} color="inherit" /> : "Save preferences"}
                </Button>
              </Paper>
              <Paper className="profile-section" elevation={0}>
                <Typography className="impact-overview-label">DANGER ZONE</Typography>
                <Typography variant="h3">Delete account</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Permanently delete your account and associated career data. This cannot be undone.
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteForeverRoundedIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete my account
                </Button>
              </Paper>
            </Stack>
          </Box>

          <Divider />
          <Box className="profile-save-bar">
            <Typography variant="body2" color="text.secondary">
              {saved ? <><CheckRoundedIcon fontSize="small" /> Changes saved</> : hasChanges ? "You have unsaved changes" : "All changes are up to date"}
            </Typography>
            <Button variant="contained" onClick={() => void saveProfile()} disabled={(!hasChanges && !hasSkillsChanges) || saving}>
              {saving ? <CircularProgress size={18} color="inherit" /> : "Save profile"}
            </Button>
          </Box>
        </>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (deletingAccount) return;
          setDeleteDialogOpen(false);
          setDeleteConfirmation("");
        }}
      >
        <DialogTitle>Delete your account permanently?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This deletes your profile, posts, comments, impact reports, and career journey. Type DELETE to confirm.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Type DELETE to confirm"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deletingAccount}>Cancel</Button>
          <Button
            color="error"
            onClick={() => void handleDeleteAccount()}
            disabled={deleteConfirmation !== "DELETE" || deletingAccount}
          >
            {deletingAccount ? <CircularProgress size={18} color="inherit" /> : "Delete account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}