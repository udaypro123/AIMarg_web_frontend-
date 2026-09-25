"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, TextField, Paper, InputAdornment, Link as MuiLink } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { PrimaryButton, SecondaryButton } from "@/components/common/Buttons";
import { forgotPassword } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";

const rowCenterStyle = { flexDirection: "row", justifyContent: "center" } as const;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { ToastContainer, toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast({ title: "Reset link sent", message: "Please check your email", severity: "success" });
    } catch {
      toast({ title: "Error", message: "Could not send reset link", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const emailSlotProps = {
    startAdornment: (
      <InputAdornment position="start">
        <EmailIcon fontSize="small" />
      </InputAdornment>
    ),
  };

  return (
    <AuthContainer>
      <ToastContainer />
      <Stack spacing={2.5}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Reset password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email and we will send you a reset link
          </Typography>
        </Box>

        {sent ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 1 }}>Check your inbox</Typography>
            <Typography variant="body2" color="text.secondary">
              If an account exists for {email}, you will receive a password reset email.
            </Typography>
            <SecondaryButton onClick={() => router.push("/auth/login")} sx={{ mt: 2 }}>
              Back to login
            </SecondaryButton>
          </Paper>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                slotProps={{ input: emailSlotProps }}
              />
              <PrimaryButton type="submit" fullWidth loading={loading}>
                Send reset link
              </PrimaryButton>
            </Stack>
          </Box>
        )}

        <Stack spacing={0.5} sx={rowCenterStyle}>
          <Link href="/auth/login">
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}>
              <ArrowBackIcon fontSize="small" /> Back to login
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </AuthContainer>
  );
}