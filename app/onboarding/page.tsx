"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Loading from "@/components/common/Loading";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { AFFECTED_AREAS, EMPLOYMENT_STATUS, IMPACT_STATUS } from "@/constants";
import { getRequestErrorMessage } from "@/services/api";
import { createImpactReport } from "@/services/impact.service";
import { getSkills } from "@/services/skill.service";
import { getProfile, updateProfile } from "@/services/user.service";
import type { Skill, User } from "@/types/api";

const steps = ["Welcome", "Impact", "Skills", "Privacy"];
const incomeImpacts = ["No change", "Increased", "Decreased", "Prefer not to say"];

export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [profile, setProfile] = useState<User | null>(null);
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [employmentStatus, setEmploymentStatus] = useState<string>(EMPLOYMENT_STATUS.EMPLOYED);
  const [impactStatus, setImpactStatus] = useState<string>(IMPACT_STATUS.NO_IMPACT);
  const [incomeImpact, setIncomeImpact] = useState(incomeImpacts[0]);
  const [impactAreas, setImpactAreas] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [discoverable, setDiscoverable] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([getProfile(), getSkills()])
      .then(([profileResult, skillsResult]) => {
        if (!active) return;
        if (profileResult.status === "rejected") {
          router.replace("/auth/login");
          return;
        }
        const user = profileResult.value;
        setProfile(user);
        setSelectedSkills(user.skills || []);
        setDiscoverable(user.privacySettings?.profileDiscoverable ?? true);
        setEmailNotifications(user.notificationPreferences?.email ?? true);
        setSmsNotifications(user.notificationPreferences?.sms ?? false);
        setWhatsappNotifications(user.notificationPreferences?.whatsapp ?? false);
        if (skillsResult.status === "fulfilled") {
          setCatalog(skillsResult.value);
        } else {
          setError(`${getRequestErrorMessage(skillsResult.reason, "The skill library could not be loaded.")} You can continue and add skills later.`);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  const toggleValue = (values: string[], value: string, setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const continueOnboarding = async () => {
    setError("");
    if (activeStep === 1) {
      if (impactAreas.length === 0) {
        setError("Choose at least one area affected by AI to continue.");
        return;
      }
      setSaving(true);
      try {
        await createImpactReport({
          employmentStatus,
          impactStatus,
          incomeImpact,
          impactAreas,
        });
        setActiveStep(2);
      } catch (requestError: unknown) {
        setError(getRequestErrorMessage(requestError, "Your impact check-in could not be saved. Please try again."));
      } finally {
        setSaving(false);
      }
      return;
    }

    if (activeStep === 2) {
      setSaving(true);
      try {
        const updated = await updateProfile({ skills: selectedSkills });
        setProfile(updated);
        setActiveStep(3);
      } catch (requestError: unknown) {
        setError(getRequestErrorMessage(requestError, "Your skills could not be saved. Please try again."));
      } finally {
        setSaving(false);
      }
      return;
    }

    if (activeStep === 3) {
      setSaving(true);
      try {
        await updateProfile({
          privacySettings: { profileDiscoverable: discoverable },
          notificationPreferences: {
            email: emailNotifications,
            sms: smsNotifications,
            whatsapp: whatsappNotifications,
          },
        });
        router.replace("/");
      } catch (requestError: unknown) {
        setError(getRequestErrorMessage(requestError, "Your preferences could not be saved. Please try again."));
      } finally {
        setSaving(false);
      }
      return;
    }

    setActiveStep((current) => current + 1);
  };

  const skipStep = () => {
    setError("");
    if (activeStep < steps.length - 1) setActiveStep((current) => current + 1);
    else router.replace("/");
  };

  if (loading) {
    return <Loading fullScreen message="Preparing your onboarding" />;
  }
  if (!profile) return null;

  return (
    <OnboardingLayout
      steps={steps}
      activeStep={activeStep}
      onBack={() => {
        setError("");
        setActiveStep((current) => Math.max(0, current - 1));
      }}
      onNext={() => void continueOnboarding()}
      onSkip={skipStep}
      hideSkip={activeStep === steps.length - 1}
      submitLabel={activeStep === steps.length - 1 ? "Finish setup" : activeStep === 0 ? "Get started" : "Continue"}
      loading={saving}
    >
      <Stack spacing={3}>
        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
        {activeStep === 0 && (
          <Stack spacing={3} sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome{profile.name ? `, ${profile.name.split(" ")[0]}` : ""} to AIMarg
            </Typography>
            <Typography color="text.secondary">
              Build a clearer picture of how AI is changing your work, grow the skills you need, and plan a practical next step.
            </Typography>
            <Paper variant="outlined" sx={{ p: 2.5, textAlign: "left" }}>
              <Stack spacing={1.5}>
                {["Record how AI is affecting your work", "Keep your professional skills current", "Track progress on your career journey", "Choose what profile and notification details to share"].map((item) => (
                  <Typography key={item} variant="body1">• {item}</Typography>
                ))}
              </Stack>
            </Paper>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Start with your experience</Typography>
              <Typography color="text.secondary">This private check-in is a snapshot, not a prediction.</Typography>
            </Box>
            <TextField select label="Employment status" value={employmentStatus} onChange={(event) => setEmploymentStatus(event.target.value)} fullWidth>
              {Object.values(EMPLOYMENT_STATUS).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField select label="How is AI affecting your work?" value={impactStatus} onChange={(event) => setImpactStatus(event.target.value)} fullWidth>
              {Object.values(IMPACT_STATUS).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField select label="Income impact" value={incomeImpact} onChange={(event) => setIncomeImpact(event.target.value)} fullWidth>
              {incomeImpacts.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </TextField>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Areas affected</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {AFFECTED_AREAS.map((area) => (
                  <Chip
                    key={area}
                    label={area}
                    clickable
                    color={impactAreas.includes(area) ? "primary" : "default"}
                    variant={impactAreas.includes(area) ? "filled" : "outlined"}
                    onClick={() => toggleValue(impactAreas, area, setImpactAreas)}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Add skills to your toolkit</Typography>
              <Typography color="text.secondary">Select what you use now. You can change this any time.</Typography>
            </Box>
            {catalog.length === 0 ? (
              <Typography color="text.secondary">The skill library is empty right now. You can add skills from your profile later.</Typography>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0.5 }}>
                {catalog.map((skill) => (
                  <FormControlLabel
                    key={skill._id}
                    control={
                      <Checkbox
                        checked={selectedSkills.includes(skill.name)}
                        onChange={() => toggleValue(selectedSkills, skill.name, setSelectedSkills)}
                      />
                    }
                    label={skill.name}
                  />
                ))}
              </Box>
            )}
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Your data, your choice</Typography>
              <Typography color="text.secondary">Choose whether your profile can be discovered and which notifications you want.</Typography>
            </Box>
            <FormControlLabel control={<Switch checked={discoverable} onChange={(event) => setDiscoverable(event.target.checked)} />} label="Make my profile discoverable to the community" />
            <FormControlLabel control={<Switch checked={emailNotifications} onChange={(event) => setEmailNotifications(event.target.checked)} />} label="Email notifications" />
            <FormControlLabel control={<Switch checked={smsNotifications} onChange={(event) => setSmsNotifications(event.target.checked)} />} label="SMS notifications" />
            <FormControlLabel control={<Switch checked={whatsappNotifications} onChange={(event) => setWhatsappNotifications(event.target.checked)} />} label="WhatsApp notifications" />
          </Stack>
        )}
      </Stack>
    </OnboardingLayout>
  );
}
