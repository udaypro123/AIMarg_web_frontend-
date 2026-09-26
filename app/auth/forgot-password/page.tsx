"use client";

import { useState } from "react";
import { Alert, Box, Button, Typography, Stack, TextField, Paper, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import Link from "next/link";
import AuthScreen from "@/components/layout/AuthScreen";
import { PrimaryButton } from "@/components/common/Buttons";
import { forgotPassword } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";

export default function ForgotPasswordPage() {
  const { ToastContainer, toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast({ title: "Reset link sent", message: "Please check your email", severity: "success" });
    } catch {
      setError("We could not send the reset email. Check the address and try again.");
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
    <>
      <ToastContainer />
      <AuthScreen eyebrow="ACCOUNT RECOVERY" title="Reset your password" subtitle="We will send a secure reset link to the email on your account.">
        <Stack spacing={2.1} className="auth-form-stack">
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          {sent ? (
            <Paper className="auth-success-panel" elevation={0}>
              <span className="auth-success-icon"><MailOutlineRoundedIcon /></span>
              <Typography variant="h3">Check your inbox</Typography>
              <Typography variant="body2">If an account exists for <strong>{email}</strong>, a reset link is on its way. You can close this page after checking your email.</Typography>
              <Button component={Link} href="/auth/login" variant="contained" fullWidth>Back to sign in</Button>
            </Paper>
          ) : (
            <>
              <Box component="form" onSubmit={handleSubmit} className="auth-form">
                <Stack spacing={1.8}>
                  <TextField
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    fullWidth
                    autoFocus
                    autoComplete="email"
                    slotProps={{ input: emailSlotProps }}
                  />
                  <PrimaryButton type="submit" fullWidth loading={loading} size="large" className="auth-submit-button">
                    Send reset link
                  </PrimaryButton>
                </Stack>
              </Box>
              <Typography className="auth-assurance">For your security, we will not reveal whether an email is registered.</Typography>
            </>
          )}
          <Box className="auth-switch">
            <Typography variant="body2">Remember your password?</Typography>
            <Link href="/auth/login">Back to sign in <span aria-hidden="true">&#8594;</span></Link>
          </Box>
        </Stack>
      </AuthScreen>
    </>
  );
}