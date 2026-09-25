"use client";

import { type ReactNode } from "react";
import { Box, Typography, Stack, Card, CardContent, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PrimaryButton } from "@/components/common/Buttons";

const steps = ["Welcome", "Impact", "Skills", "Privacy"];

export default function OnboardingPage() {
  return (
    <OnboardingLayout steps={steps} activeStep={0} onBack={() => {}} onNext={() => {}}>
      <Stack spacing={3} sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Welcome to AIMarg
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AIMarg helps you understand how AI is changing your career. Track impact, identify skill gaps, and plan your next move.
        </Typography>
        <Card variant="outlined" sx={{ textAlign: "left" }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              What you can do:
            </Typography>
            <Stack spacing={1}>
              {["Understand your AI impact", "Identify skill gaps", "Track career transition", "Protect your privacy"].map((item) => (
                <Typography key={item} variant="body2" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }} />
                  {item}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
        <PrimaryButton endIcon={<ArrowForwardIcon />}>Get Started</PrimaryButton>
      </Stack>
    </OnboardingLayout>
  );
}