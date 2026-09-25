"use client";

import { type ReactNode } from "react";
import { Stepper, Step, StepLabel, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PendingIcon from "@mui/icons-material/Pending";
import type { Step as StepType } from "@/types";

const statusIcons: Record<string, ReactNode> = {
  completed: <CheckCircleIcon color="success" />,
  active: <PendingIcon color="primary" />,
  pending: <RadioButtonUncheckedIcon color="disabled" />,
};

export function TimelineStepper({ steps, orientation = "vertical" }: { steps: StepType[]; orientation?: "horizontal" | "vertical" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stepper activeStep={steps.findIndex((s) => !s.completed && !s.active) > -1 ? steps.findIndex((s) => !s.completed) : steps.length} orientation={isMobile && orientation === "horizontal" ? "vertical" : orientation}>
      {steps.map((step, index) => (
        <Step key={index} completed={step.completed}>
          <StepLabel>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {statusIcons[step.completed ? "completed" : step.active ? "active" : "pending"]}
              <Typography variant={step.active || step.completed ? "subtitle2" : "body2"} color={step.completed || step.active ? "text.primary" : "text.disabled"}>
                {step.label}
              </Typography>
            </Box>
            {step.description && isMobile ? null : step.description}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}