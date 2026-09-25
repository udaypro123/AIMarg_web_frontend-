"use client";

import { type ReactNode, useState } from "react";
import { Box, Typography, Stack, Card, CardContent, Chip, Grid, Paper, Switch, FormControlLabel, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "@/components/common/PageHeader";
import { PrimaryButton, GhostButton } from "@/components/common/Buttons";

export default function ProfilePage() {
  const [analytics, setAnalytics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(true);

  return (
    <Stack spacing={3}>
      <PageHeader title="Profile" subtitle="Manage your account and privacy settings" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "primary.light", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", mb: 2, fontSize: 32, fontWeight: 700 }}>
                U
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Uday</Typography>
              <Typography variant="body2" color="text.secondary">uday@example.com</Typography>
              <Chip label="User" size="small" color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Account Information</Typography>
            <Stack spacing={2}>
              <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2">Name: Uday</Typography>
              </Stack>
              <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">Email: uday@example.com</Typography>
              </Stack>
              <Divider />
              <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
                <SecurityIcon fontSize="small" color="action" />
                <Typography variant="body2">Password: ******</Typography>
                <GhostButton sx={{ ml: "auto" }}>Change</GhostButton>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Privacy Settings</Typography>
        <Stack spacing={2}>
          <FormControlLabel control={<Switch checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />} label="Participate in anonymized analytics" />
          <FormControlLabel control={<Switch checked={aiProcessing} onChange={(e) => setAiProcessing(e.target.checked)} />} label="Allow AI data processing" />
          <FormControlLabel control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />} label="Enable notifications" />
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Danger Zone</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These actions are irreversible. Please proceed with caution.
        </Typography>
        <Stack spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
          <PrimaryButton variant="outlined" startIcon={<DownloadIcon />}>Download My Data</PrimaryButton>
          <PrimaryButton color="error" variant="outlined" startIcon={<DeleteIcon />}>Delete Account</PrimaryButton>
        </Stack>
      </Paper>
    </Stack>
  );
}