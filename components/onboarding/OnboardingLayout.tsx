"use client";

import { type ReactNode } from "react";
import { Stepper, Step, StepLabel, Box, Typography, Button, Paper, Stack } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "../common/Buttons";

export function OnboardingLayout({
  steps,
  activeStep,
  onBack,
  onNext,
  onSkip,
  children,
  hideSkip = false,
  submitLabel = "Continue",
  loading = false,
}: {
  steps: string[];
  activeStep: number;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  children: ReactNode;
  hideSkip?: boolean;
  submitLabel?: string;
  loading?: boolean;
}) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: { xs: 2, md: 0 }, pt: { xs: 4, md: 6 }, pb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
          AIMarg
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          Track the Changing World of Work
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          mx: { xs: 0, md: "auto" },
          width: "100%",
          maxWidth: 720,
          borderRadius: { xs: 0, md: 4 },
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>{children}</Box>
        <Box sx={{ px: { xs: 3, md: 6 }, py: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            {activeStep > 0 && (
              <SecondaryButton onClick={onBack}>Back</SecondaryButton>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {!hideSkip && onSkip && (
              <Button onClick={onSkip} sx={{ color: "text.secondary" }}>
                Skip
              </Button>
            )}
            <PrimaryButton onClick={onNext} loading={loading}>
              {submitLabel}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
