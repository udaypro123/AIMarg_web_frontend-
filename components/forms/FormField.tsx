"use client";

import { type ReactNode } from "react";
import { TextField as MuiTextField, type TextFieldProps, type InputProps } from "@mui/material";
import { type FormFieldProps } from "@/types";

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  select = false,
  options = [],
  multiline = false,
  rows = 4,
  startAdornment,
  endAdornment,
  ...props
}: FormFieldProps & Omit<TextFieldProps, "name" | "label" | "error" | "slotProps">) {
  const slotProps = {
    input: {
      startAdornment,
      endAdornment,
    } as InputProps,
  };

  return (
    <MuiTextField
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      error={!!error}
      helperText={error ?? helperText}
      select={select}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      slotProps={slotProps}
      fullWidth
      sx={{ mb: 2 }}
      {...props}
    >
      {select &&
        options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
    </MuiTextField>
  );
}