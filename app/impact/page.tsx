"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { AFFECTED_AREAS, EMPLOYMENT_STATUS, IMPACT_STATUS } from "@/constants";
import { createImpactReport, getMyImpactReports, type NewImpactReport } from "@/services/impact.service";
import { getProfile } from "@/services/user.service";
import type { ImpactReport } from "@/types/api";

export default function ImpactPage() {
  const [reports, setReports] = useState<ImpactReport[]>([]);
  const [employmentStatus, setEmploymentStatus] = useState<string>(EMPLOYMENT_STATUS.EMPLOYED);
  const [impactStatus, setImpactStatus] = useState<string>(IMPACT_STATUS.NO_IMPACT);
  const [incomeImpact, setIncomeImpact] = useState("No change");
  const [impactAreas, setImpactAreas] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getMyImpactReports(), getProfile()])
      .then(([myReports, profile]) => {
        if (!active) return;
        setReports(myReports);
        if (profile.employmentStatus) setEmploymentStatus(profile.employmentStatus);
      })
      .catch(() => {
        if (active) setError("We could not load your impact reports. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const latest = reports[0];
  const toggleArea = (area: string) => {
    setImpactAreas((current) => current.includes(area)
      ? current.filter((item) => item !== area)
      : [...current, area]);
  };

  const submitAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (impactAreas.length === 0) {
      setError("Choose at least one area, or select Other.");
      return;
    }
    setSaving(true);
    setError("");
    const report: NewImpactReport = { employmentStatus, impactStatus, impactAreas, incomeImpact, description };
    try {
      const created = await createImpactReport(report);
      setReports((current) => [created, ...current]);
      setDialogOpen(false);
      setImpactAreas([]);
      setDescription("");
    } catch {
      setError("Your assessment could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openAssessment = () => {
    setError("");
    setDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Box className="page-heading-row">
        <Box>
          <Typography className="page-eyebrow">CAREER SIGNALS</Typography>
          <Typography variant="h1" className="page-title">AI impact</Typography>
          <Typography className="page-subtitle">Your work is changing. Keep a clear record of how.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAssessment}>New assessment</Button>
      </Box>

      {error && !dialogOpen && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Box className="impact-overview">
        <Box className="impact-overview-main">
          <span className="impact-icon"><InsightsRoundedIcon /></span>
          <Box>
            <Typography className="impact-overview-label">LATEST SELF-REPORT</Typography>
            <Typography className="impact-overview-value">{loading ? "Loading report" : latest?.impactStatus || "No assessment yet"}</Typography>
            <Typography className="impact-overview-caption">
              {latest ? `Recorded ${new Date(latest.createdAt).toLocaleDateString()}` : "Start with what has changed in your day-to-day work."}
            </Typography>
          </Box>
        </Box>
        <Box className="impact-overview-side">
          <Typography className="impact-overview-label">REPORTS</Typography>
          <Typography className="impact-count">{reports.length.toString().padStart(2, "0")}</Typography>
        </Box>
      </Box>

      <Box className="section-heading-row">
        <Box>
          <Typography variant="h2" className="section-title">Assessment history</Typography>
          <Typography className="section-caption">Every entry is private to your account.</Typography>
        </Box>
      </Box>

      {loading ? (
        <Box className="loading-state"><CircularProgress size={25} /></Box>
      ) : reports.length === 0 ? (
        <Paper className="empty-state">
          <Typography variant="h3">Your first check-in starts here</Typography>
          <Typography color="text.secondary">There is no right or wrong answer. This is a snapshot of your experience, not a prediction.</Typography>
          <Button variant="outlined" onClick={openAssessment}>Start an assessment</Button>
        </Paper>
      ) : (
        <Stack className="report-list" spacing={0}>
          {reports.map((report) => (
            <Paper key={report._id} className="report-row" elevation={0}>
              <Box className="report-date-block">
                <Typography>{new Date(report.createdAt).toLocaleDateString(undefined, { month: "short" })}</Typography>
                <strong>{new Date(report.createdAt).getDate().toString().padStart(2, "0")}</strong>
              </Box>
              <Box className="report-copy">
                <Typography variant="subtitle1">{report.impactStatus}</Typography>
                <Typography variant="body2" color="text.secondary">{report.employmentStatus} | income: {report.incomeImpact}</Typography>
                {report.impactAreas.length > 0 && <Typography className="report-areas">{report.impactAreas.join(" | ")}</Typography>}
                {report.description && <Typography className="report-description">{report.description}</Typography>}
              </Box>
              <span className="report-indicator" aria-hidden="true" />
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitAssessment}>
          <DialogTitle className="dialog-heading">
            <Typography className="page-eyebrow">YOUR CHECK-IN</Typography>
            <Typography variant="h2" className="section-title">What has changed?</Typography>
          </DialogTitle>
          <DialogContent className="assessment-form">
            {error && <Alert severity="error">{error}</Alert>}
            <TextField select label="Employment status" value={employmentStatus} onChange={(event) => setEmploymentStatus(event.target.value)} fullWidth>
              {Object.values(EMPLOYMENT_STATUS).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField select label="How is AI affecting your work?" value={impactStatus} onChange={(event) => setImpactStatus(event.target.value)} fullWidth>
              {Object.values(IMPACT_STATUS).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField select label="Income impact" value={incomeImpact} onChange={(event) => setIncomeImpact(event.target.value)} fullWidth>
              {["No change", "Increased", "Decreased", "Prefer not to say"].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </TextField>
            <Box>
              <Typography className="form-label">Areas affected</Typography>
              <Box className="area-options">
                {AFFECTED_AREAS.map((area) => (
                  <FormControlLabel key={area} control={<Checkbox checked={impactAreas.includes(area)} onChange={() => toggleArea(area)} size="small" />} label={area} />
                ))}
              </Box>
            </Box>
            <TextField label="Anything you want to add?" value={description} onChange={(event) => setDescription(event.target.value)} multiline minRows={3} fullWidth />
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? <CircularProgress size={18} color="inherit" /> : "Save check-in"}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}