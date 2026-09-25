"use client";

import { type ReactNode, useState } from "react";
import { Box, Typography, Tabs, Chip } from "@mui/material";
import { type AssessmentQuestionProps } from "../../types";

export function AssessmentQuestion({
  question,
  description,
  options,
  value,
  onChange,
  error,
  helperText,
}: AssessmentQuestionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        {question}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => onChange(option.value)}
              color={isActive ? "primary" : "default"}
              variant={isActive ? "filled" : "outlined"}
              disabled={option.disabled}
              sx={{ py: 1.5, px: 1 }}
            />
          );
        })}
      </Box>
      {(error || helperText) && (
        <Typography variant="caption" color={error ? "error.main" : "text.secondary"} sx={{ mt: 1, display: "block" }}>
          {error ?? helperText}
        </Typography>
      )}
    </Box>
  );
}
