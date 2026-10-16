"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import Loading from "@/components/common/Loading";
import { getRequestErrorMessage, setAccessToken } from "@/services/api";
import { deleteMyAccount, downloadResume, getProfile, updateProfile, uploadResume } from "@/services/user.service";
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
      .catch((requestError: unknown) => {
        if (active) setError(getRequestErrorMessage(requestError, "Your profile could not be loaded. Please refresh and try again."));
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
    const isHRProfile = profile.roles?.includes("HR") ?? false;
    const requiredFields: Array<[string, string | undefined]> = [
      ["Full name", profile.name],
      ["Country", profile.country],
      ["Experience", profile.experience],
      ["Current role", profile.currentRole],
      ...(!isHRProfile ? [
        ["Previous role", profile.previousRole],
        ["Previous company", profile.previousCompany],
      ] as Array<[string, string | undefined]> : []),
      ["Company", profile.company],
      ["Job description", profile.jobDescription],
      ["LinkedIn URL", profile.linkedinUrl],
      ...(!isHRProfile ? [["GitHub URL", profile.githubUrl] as [string, string | undefined]] : []),
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
    const urlsToValidate: Array<[string, string | undefined]> = [
      ["LinkedIn URL", profile.linkedinUrl],
      ...(!isHRProfile ? [["GitHub URL", profile.githubUrl] as [string, string | undefined]] : []),
    ];
    const invalidUrls = urlsToValidate.filter(([, value]) => {
      try {
        if (!value?.trim()) return false;
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
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "Your changes could not be saved. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    const supportedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if ((extension !== "pdf" && extension !== "docx") || !supportedMimeTypes.includes(file.type)) {
      setError("Choose a PDF or DOCX resume.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be 5 MB or smaller.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    setUploading(true);
    setError("");
    try {
      const resume = await uploadResume(file);
      setProfile((current) => current ? { ...current, resume } : current);
    } catch (uploadError: unknown) {
      setError(getRequestErrorMessage(uploadError, "Resume upload failed. Use a PDF or DOCX file and try again."));
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
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "Your resume could not be downloaded."));
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
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "Your privacy and notification settings could not be saved. Please try again."));
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
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "Your account could not be deleted. Please try again."));
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
  const isHRProfile = Boolean(profile?.roles?.includes("HR"));

  return (
    <Stack spacing={3} className={isHRProfile ? "profile-page is-hr-profile" : "profile-page"}>
      <Box className="page-heading-row">
        <Box>
          <Typography className="page-eyebrow">{isHRProfile ? "HR WORKSPACE" : "ACCOUNT DETAILS"}</Typography>
          <Typography variant="h1" className="page-title">{isHRProfile ? "Your HR profile" : "Your profile"}</Typography>
          <Typography className="page-subtitle">
            {isHRProfile
              ? "Help candidates understand your role, organization, and professional expertise."
              : "Keep your career details and contact information up to date."}
          </Typography>
        </Box>
        {profile && <Avatar className="profile-large-avatar">{profile.name?.charAt(0).toUpperCase() || "U"}</Avatar>}
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {loading ? <Box className="loading-state"><Loading message="Loading your profile..." /></Box> : profile && (
        <>
          {isHRProfile && (
            <Paper className="hr-profile-summary" elevation={0}>
              <Box className="hr-profile-summary-identity">
                <Avatar className="hr-profile-summary-avatar">{profile.name?.charAt(0).toUpperCase() || "H"}</Avatar>
                <Box className="hr-profile-summary-copy">
                  <Typography className="hr-profile-summary-eyebrow">HR PROFILE SNAPSHOT</Typography>
                  <Typography className="hr-profile-summary-name">{profile.name}</Typography>
                  <Typography className="hr-profile-summary-role">
                    {[profile.currentRole, profile.company].filter(Boolean).join(" at ") || "Add your role and organization below"}
                  </Typography>
                </Box>
              </Box>
              <Box className="hr-profile-summary-facts">
                <Box className="hr-profile-summary-fact">
                  <WorkOutlineRoundedIcon />
                  <span><strong>{profile.experience || "Add experience"}</strong><small>Experience</small></span>
                </Box>
                <Box className="hr-profile-summary-fact">
                  <GroupsRoundedIcon />
                  <span><strong>{profile.skills?.length ?? 0} skills</strong><small>Expertise</small></span>
                </Box>
                <Box className="hr-profile-summary-fact">
                  <BusinessRoundedIcon />
                  <span><strong>{profile.privacySettings?.profileDiscoverable ?? true ? "Discoverable" : "Private"}</strong><small>Profile visibility</small></span>
                </Box>
              </Box>
              <Typography className="hr-profile-summary-hint">
                Keep your role, organization, expertise, and LinkedIn details current so candidates can recognize your HR profile.
              </Typography>
            </Paper>
          )}

          <Box className="profile-layout">
            <Stack spacing={2.5}>
              <Paper className="profile-section" elevation={0}>
                <Box className="section-heading-row">
                  <Box>
                    <Typography className="impact-overview-label">{isHRProfile ? "YOUR IDENTITY" : "BASICS"}</Typography>
                    <Typography variant="h2" className="section-title">{isHRProfile ? "Personal & contact details" : "Personal details"}</Typography>
                  </Box>
                </Box>
                <Box className="profile-form-grid">
                  <TextField label="Full name" placeholder="Enter your full name" value={profile.name || ""} onChange={(event) => updateField("name", event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="Email address" value={profile.email || ""} disabled required fullWidth helperText="Email address is managed by your sign-in settings." />
                  <TextField label="Country" placeholder="Enter your country" value={profile.country || ""} onChange={(event) => updateField("country", event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Box>
              </Paper>

              <Paper className="profile-section" elevation={0}>
                <Box className="section-heading-row">
                  <Box>
                    <Typography className="impact-overview-label">{isHRProfile ? "HR CAREER" : "CAREER"}</Typography>
                    <Typography variant="h2" className="section-title">{isHRProfile ? "Role & expertise" : "Professional details"}</Typography>
                  </Box>
                </Box>
                <Box className="profile-form-grid">
                  <TextField label={isHRProfile ? "HR role / job title" : "Current role"} placeholder={isHRProfile ? "e.g. Talent Acquisition Partner" : "e.g. Product designer"} value={profile.currentRole || ""} onChange={(event) => updateField("currentRole", event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label={isHRProfile ? "Organization" : "Company"} placeholder="Enter your company name" value={profile.company || ""} onChange={(event) => updateField("company", event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label={isHRProfile ? "HR / professional experience" : "Experience"} placeholder="e.g. 5 years" value={profile.experience || ""} onChange={(event) => updateField("experience", event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="Previous role" placeholder="Enter your previous role" value={profile.previousRole || ""} onChange={(event) => updateField("previousRole", event.target.value)} required={!isHRProfile} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="Previous company" placeholder="Enter your previous company" value={profile.previousCompany || ""} onChange={(event) => updateField("previousCompany", event.target.value)} required={!isHRProfile} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="How you use AI" placeholder="Describe how AI fits into your work" value={profile.aiUsage || ""} onChange={(event) => updateField("aiUsage", event.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label={isHRProfile ? "Recruiting skills & expertise" : "Skills (comma separated)"} placeholder={isHRProfile ? "e.g. Talent acquisition, interviewing, HR" : "e.g. Research, communication, Python"} value={skillsInput} onChange={(event) => {
                    setSaved(false);
                    setSkillsInput(event.target.value);
                  }} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="LinkedIn URL" placeholder="https://linkedin.com/in/your-name" value={profile.linkedinUrl || ""} onChange={(event) => updateField("linkedinUrl", event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="GitHub URL" placeholder="https://github.com/your-username" value={profile.githubUrl || ""} onChange={(event) => updateField("githubUrl", event.target.value)} required={!isHRProfile} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label={isHRProfile ? "About your HR role" : "Role description"} placeholder={isHRProfile ? "Describe your hiring focus and how you support candidates" : "Describe your role and responsibilities"} value={profile.jobDescription || ""} onChange={(event) => updateField("jobDescription", event.target.value)} required multiline minRows={3} className="profile-description-field" fullWidth slotProps={{ inputLabel: { shrink: true } }} />


                </Box>
                <Typography variant="body2" color="text.secondary" style={{ backgroundColor:  'transparent !important', marginTop: '8px', marginBottom: '0px', color:  hasChanges ? 'red' : 'blue' }}>
                  {saved ? <><CheckRoundedIcon fontSize="small" /> Changes saved</> : hasChanges ? "You have unsaved changes" : "All changes are up to date"}
                </Typography>
                <Box className="profile-save-bar">

                  <Button variant="contained" onClick={() => void saveProfile()} disabled={(!hasChanges && !hasSkillsChanges) || saving}>
                    {saving ? <CircularProgress size={18} color="inherit" /> : "Save profile"}
                  </Button>
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
                <input ref={fileInput} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onChange={(event) => void handleUpload(event.target.files?.[0])} />
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
                {/* <Typography variant="h3" style={{ backgroundColor: 'transparent !important' }} className="section-title">
                  Delete account
                </Typography> */}
                <Typography variant="body2" sx={{ mt: 0.5, mb: 1.5, backgroundColor: 'transparent !important', color: 'blue' }}>
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
            placeholder="Type DELETE here"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
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